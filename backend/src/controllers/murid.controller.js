import prisma from '../config/prisma.js'

export const listMurid = async (req, res) => {
  try {
    // Only GURU can access; ensured by middleware
    // If you want to filter by guru, use req.user.id to find guruId
    const murid = await prisma.murid.findMany({
      include: { wali: { select: { id: true, user: { select: { nama: true, email: true } } } }, guru: { select: { id: true, user: { select: { nama: true, email: true } } } } }
    })
    return res.json(murid)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal mengambil data murid' })
  }
}

