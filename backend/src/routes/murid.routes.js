import { Router } from 'express'
import { listMurid } from '../controllers/murid.controller.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, authorize('GURU'), listMurid)

export default router

