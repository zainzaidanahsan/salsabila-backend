import prisma from '../config/prisma.js'

export const tambahNilai = async (req, res) => {
  try {
    const { muridId, mataPelajaran, nilai, keterangan } = req.body
    if (!muridId || !mataPelajaran || typeof nilai !== 'number') {
      return res.status(400).json({ message: 'muridId, mataPelajaran, nilai wajib' })
    }

    // Optional: ensure requester is the assigned GURU of the murid
    const murid = await prisma.murid.findUnique({ where: { id: Number(muridId) } })
    if (!murid) return res.status(404).json({ message: 'Murid tidak ditemukan' })

    // req.user.id is User id. Find guru record
    const guru = await prisma.guru.findUnique({ where: { userId: req.user.id } })
    if (!guru) return res.status(403).json({ message: 'Hanya GURU yang dapat input nilai' })
    if (murid.guruId !== guru.id) return res.status(403).json({ message: 'Bukan wali kelas / guru murid ini' })

    const created = await prisma.nilai.create({
      data: {
        muridId: murid.id,
        guruId: guru.id,
        mataPelajaran,
        nilai,
        keterangan: keterangan || null
      }
    })
    return res.status(201).json(created)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal menambah nilai' })
  }
}

export const lihatNilaiMurid = async (req, res) => {
  try {
    const { muridId } = req.params
    const murid = await prisma.murid.findUnique({ where: { id: Number(muridId) }, include: { wali: true } })
    if (!murid) return res.status(404).json({ message: 'Murid tidak ditemukan' })

    // Only wali murid of this child can view
    const wali = await prisma.waliMurid.findUnique({ where: { userId: req.user.id } })
    if (!wali || wali.id !== murid.waliId) return res.status(403).json({ message: 'Tidak berhak mengakses nilai murid ini' })

    const daftarNilai = await prisma.nilai.findMany({
      where: { muridId: murid.id },
      orderBy: { tanggal: 'desc' }
    })
    return res.json({ murid: { id: murid.id, nama: murid.nama, kelas: murid.kelas }, nilai: daftarNilai })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal mengambil nilai' })
  }
}

