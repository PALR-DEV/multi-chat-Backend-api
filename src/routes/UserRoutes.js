import express from 'express';
import authService from '../Services/AuthService.js';
const router = express.Router();
import authenticateToken from '../config/authMiddleware.js';
import multer from 'multer';
import profileImageService from '../Services/ProfileImageService.js';


const upload = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     fileSize: 5 * 1024 * 1024 // 5MB limit
    // },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

// GET route to fetch all users
// router.get('/users', async (req, res) => {
//     try {
//         // TODO: Add your logic to fetch users from database
//         res.status(200).json({ message: "Users fetched successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.post('/login', async(req,res) => {
    try {
        const { email, password } = req.body;
        await authService.login(email, password).then((user) => {
            if (user) {
                res.status(200).json({ success: true, message: "User logged in successfully", data: user });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        })
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
})

router.post('/add-user', async (req, res) => {
    try {
        const { payload } = req.body;
        //add User in auth service
        await authService.checkEmail(payload.email).then(async(exists) => {
            if (exists) {
                res.status(400).json({
                    success: false,
                    message: "Email already exists",
                    exists: true
                });
            } else {
                await authService.addUser(payload).then(() => {
                    res.status(201).json({ success: true, message: "User added successfully" });
                })
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// GET route to fetch a specific user by ID
// router.get('/get-user/:id', async (req, res) => {
//     try {
//         const userId = req.params.id;
//         await authService.getUser(userId).then((user) => {
//             res.status(200).json({ success: true, message: "User fetched successfully", data: user });
//         })
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        await authService.checkEmail(email).then((exists) => {
            if (exists) {
                res.status(200).json({
                    success: false,
                    message: "Email already exists",
                    exists: true
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Email is available",
                    exists: false
                });
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    //TODO: i need to add a route to hash the password for now just let it be plain text

})

// router.get('/get-users', authenticateToken, async (req, res) => {
//     try {
//         await authService.getAllUsers().then((users) => {
//             res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
//         })
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// })

router.get('/get-user-info', authenticateToken, async (req, res) => {
    try {
        // Extract token from Bearer authorization header
        const bearerToken = req.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided or invalid format" });
        }
        const token = bearerToken.substring(7); // Remove 'Bearer ' prefix
        
        await authService.getUserInfo(token).then((user) => {
            res.status(200).json({ success: true, message: "User fetched successfully", data: user });
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/update-profile-picture', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;
        const userId = req.user.id; 
        const result = await profileImageService.updateProfilePictureBinary(userId, imageBuffer);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/profile-picture', async(req, res) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const user = await authService.getUserInfo(token);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        const imageBase64 = await profileImageService.getProfilePicture(user.id);
        if (!imageBase64) {
            return res.status(404).json({ success: false, message: 'Profile picture not found' });
        }

        const img = Buffer.from(imageBase64, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length,
            'Cache-Control': 'public, max-age=5' // Cache for 5 seconds
        });
        res.end(img);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/get-search-profile-pics', async (req, res) => {
    try {
        const userIds = req.body.ids ? req.body.ids : [];
        
        if (userIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No user IDs provided' 
            });
        }

        const profilePictures = await Promise.all(
            userIds.map(async (userId) => {
                const imageBase64 = await profileImageService.getProfilePicture(userId);
                return {
                    userId,
                    image: imageBase64 || null
                };
            })
        );

        res.status(200).json({
            success: true,
            data: profilePictures.filter(pic => pic.image !== null)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/logout', authenticateToken, async(req, res) => {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided or invalid format" });
        }
        const token = bearerToken.substring(7);

        const result = await authService.logout(token);
        if (result) {
            res.status(200).json({ success: true, message: "User logged out successfully" });
        } else {
            res.status(401).json({ success: false, message: "Logout failed" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




export default router;
