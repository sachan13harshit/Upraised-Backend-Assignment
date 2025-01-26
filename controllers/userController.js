const bcrypt = require('bcrypt')
const z = require('zod');
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();


const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name : z.string().min(3)
});


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});


const register = async (req, res) => {
    const {email, password, name} = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            },select : {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
        res.json({
            message: "User created successfully",
            data: user , token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
          } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    }
}


const login = async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
      } else {
        res.status(500).json({ error: 'Login failed' });
      }
    }
  };
  
  module.exports = {
    register,
    login
  };




