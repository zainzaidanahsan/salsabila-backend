import { Router } from 'express'
import { tambahNilai, lihatNilaiMurid } from '../controllers/nilai.controller.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.post('/', authenticate, authorize('GURU'), tambahNilai)
router.get('/:muridId', authenticate, authorize('WALI_MURID'), lihatNilaiMurid)

export default router

