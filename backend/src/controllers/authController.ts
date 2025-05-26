import { Request, Response } from 'express';
import { register, login } from '../services/UserService'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await register(email, hashPassword)
    console.log(user)
    res.status(200).json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error login" })
  }

}

export const Login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const user = await login(email, password);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });


  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1d' })

  return res.json({ user, token })


}