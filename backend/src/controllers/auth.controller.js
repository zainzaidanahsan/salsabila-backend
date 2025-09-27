import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import prisma from '../config/prisma.js'

dotenv.config()

const signToken = (user) => {
  const payload = { id: user.id, role: user.role, email: user.email, nama: user.nama }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const register = async (req, res) => {
  try {
    const { nama, email, password, role, mataPelajaran, telepon, namaAnak, kelas, guruId } = req.body
    if (!nama || !email || !password || !role ) {
      return res.status(400).json({ message: 'nama, email, password, role wajib' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Email sudah terdaftar' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { nama, email, password: hashed, role }
    })

    // Create profile depending on role
    if (role === 'GURU') {
      await prisma.guru.create({ data: { userId: user.id, mataPelajaran: mataPelajaran || 'Umum' } })
    } else if (role === 'WALI_MURID') {
      // Create Wali Murid profile
      const wali = await prisma.waliMurid.create({ data: { userId: user.id, telepon: telepon || null } })

      // Require child's name; optional kelas and guruId
      if (!namaAnak) {
        return res.status(400).json({ message: 'namaAnak wajib untuk WALI_MURID' })
      }

      // If guruId not provided, pick any existing guru as default if available
      let assignedGuruId = guruId
      if (!assignedGuruId) {
        const anyGuru = await prisma.guru.findFirst()
        if (!anyGuru) {
          return res.status(400).json({ message: 'Belum ada guru terdaftar, hubungi admin' })
        }
        assignedGuruId = anyGuru.id
      }

      // Create Murid linked to this parent and guru
      const murid = await prisma.murid.create({
        data: {
          nama: namaAnak,
          kelas: kelas || 'A',
          waliId: wali.id,
          guruId: assignedGuruId
        }
      })

      // Attach murid info for response
      user.muridId = murid.id
      user.muridNama = murid.nama
    }

    const token = signToken(user)
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        ...(user.muridId ? { muridId: user.muridId, muridNama: user.muridNama } : {})
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Register gagal' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'email dan password wajib' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Email atau password salah' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Email atau password salah' })

    const token = signToken(user)
    return res.json({ token, user: { id: user.id, nama: user.nama, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Login gagal' })
  }
}
