import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { requireAuth, rateLimitLogin, resetLoginAttempts, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nexora_super_secret_jwt_key_2026_enterprise';
const PASSWORD_RESET_KEY = process.env.PASSWORD_RESET_KEY || '3456';

// Helper to strip sensitive information
const sanitizeUser = (user: any) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

// 1. Student / User Registration
router.post('/register', async (req, res): Promise<any> => {
  try {
    const {
      name,
      username,
      email,
      password,
      branch,
      customBranch,
      degree,
      college,
      targetRole,
      prepLevel,
      studyTime,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username is required.' });
    }
    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3 || !/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return res.status(400).json({ error: 'Username must be at least 3 characters and contain only letters, numbers, or underscores.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check existing accounts
    const existingUser = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return res.status(409).json({ error: 'This username is already taken. Please choose another.' });
      }
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (Public registration can NEVER assign admin role)
    const newUser = new User({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role: 'student', // enforced server-side
      branch: branch || 'Computer Science and Engineering',
      customBranch: customBranch || '',
      degree: degree || 'Bachelor of Technology (B.Tech.)',
      college: college || 'Engineering College',
      targetRole: targetRole || 'Software Developer',
      prepLevel: prepLevel || 'Intermediate',
      studyTime: studyTime || '2 hours',
      onboarded: false,
      lastSeenAt: new Date(),
    });

    await newUser.save();

    // Initialize clean UserProgress document for this user
    const today = new Date().toISOString().split('T')[0];
    const initialProgress = new UserProgress({
      userId: newUser._id,
      completedLessons: [],
      completedModules: [],
      bookmarks: [],
      notes: [],
      quizAttempts: [],
      aptitudeAttempts: [],
      codingSolved: [],
      interviewSessions: [],
      streak: {
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        activityDates: [today],
      },
      lastActivityAt: new Date(),
    });

    await initialProgress.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id.toString(), role: newUser.role, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    console.error('[NEXORA Auth] Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// 2. User Login
router.post('/login', rateLimitLogin, async (req, res): Promise<any> => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: cleanId }, { email: cleanId }],
    }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    // Reset rate limiter on successful login
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    resetLoginAttempts(ip);

    // Update last seen and streak
    user.lastSeenAt = new Date();
    await user.save();

    // Update login streak in UserProgress
    const today = new Date().toISOString().split('T')[0];
    const progress = await UserProgress.findOne({ userId: user._id });
    if (progress) {
      const dates = progress.streak.activityDates || [];
      if (!dates.includes(today)) {
        dates.push(today);
        progress.streak.activityDates = dates;
        const lastDate = progress.streak.lastActivityDate;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (lastDate === yesterday) {
          progress.streak.currentStreak += 1;
        } else if (lastDate !== today) {
          progress.streak.currentStreak = 1;
        }

        if (progress.streak.currentStreak > progress.streak.longestStreak) {
          progress.streak.longestStreak = progress.streak.currentStreak;
        }

        progress.streak.lastActivityDate = today;
      }
      progress.lastActivityAt = new Date();
      await progress.save();
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('[NEXORA Auth] Login error:', err);
    return res.status(500).json({ error: 'Server error during sign in.' });
  }
});

// 3. Dedicated Administrator Login
router.post('/admin-login', rateLimitLogin, async (req, res): Promise<any> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Admin username/email and password are required.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: cleanId }, { email: cleanId }],
    }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Account does not have administrator privileges.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Administrator account is deactivated.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    resetLoginAttempts(ip);

    user.lastSeenAt = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id.toString(), role: 'admin', username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Administrator authenticated successfully.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('[NEXORA Auth] Admin login error:', err);
    return res.status(500).json({ error: 'Server error during admin authentication.' });
  }
});

// 4. Get Current User Profile
router.get('/me', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  return res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

// 5. Update Profile
router.put('/profile', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const allowedFields = [
      'name',
      'branch',
      'customBranch',
      'degree',
      'college',
      'yearOrSemester',
      'cgpa',
      'gradYear',
      'prefLanguage',
      'targetRole',
      'careerInterests',
      'skills',
      'preparationGoals',
      'prepLevel',
      'studyTime',
      'learningPreferences',
      'onboarded',
    ];

    const updates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user!._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitizeUser(updatedUser),
    });
  } catch (err: any) {
    console.error('[NEXORA Auth] Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// 6. Verify Account & Recovery Key (Step 1 of Password Reset)
router.post('/verify-recovery-key', rateLimitLogin, async (req, res): Promise<any> => {
  try {
    const { identifier, recoveryKey } = req.body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ error: 'Username or email address is required.' });
    }
    if (!recoveryKey || !recoveryKey.trim()) {
      return res.status(400).json({ error: 'Recovery key is required.' });
    }

    // Verify recovery key against server environment variable
    if (recoveryKey.trim() !== PASSWORD_RESET_KEY) {
      return res.status(400).json({ error: 'Invalid recovery key. Please check the key and try again.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: cleanId }, { email: cleanId }],
    });

    if (!user) {
      return res.status(404).json({ error: 'No account found matching this username or email.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact an administrator.' });
    }

    return res.json({
      success: true,
      message: 'Recovery key verified successfully.',
      username: user.username,
      name: user.name,
    });
  } catch (err: any) {
    console.error('[NEXORA Auth] Verify recovery key error:', err);
    return res.status(500).json({ error: 'Server error while verifying recovery key.' });
  }
});

// 7. Reset Password (Step 2 of Password Reset)
router.post('/reset-password', rateLimitLogin, async (req, res): Promise<any> => {
  try {
    const { identifier, recoveryKey, newPassword, confirmPassword } = req.body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ error: 'Username or email address is required.' });
    }
    if (!recoveryKey || !recoveryKey.trim()) {
      return res.status(400).json({ error: 'Recovery key is required.' });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Both new password and confirmation password are required.' });
    }

    // Validate recovery key
    if (recoveryKey.trim() !== PASSWORD_RESET_KEY) {
      return res.status(400).json({ error: 'Invalid recovery key.' });
    }

    // Validate matching passwords
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation password do not match.' });
    }

    // Validate minimum password length
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: cleanId }, { email: cleanId }],
    }).select('+passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'No account found matching this username or email.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact an administrator.' });
    }

    // Securely hash new password with bcrypt
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    // Reset rate limiter on successful password update
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    resetLoginAttempts(ip);

    return res.json({
      success: true,
      message: 'Password has been successfully reset. You may now sign in with your new password.',
    });
  } catch (err: any) {
    console.error('[NEXORA Auth] Reset password error:', err);
    return res.status(500).json({ error: 'Server error while resetting password.' });
  }
});

export default router;

