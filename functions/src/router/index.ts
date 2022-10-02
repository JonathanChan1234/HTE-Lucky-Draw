import { Router } from 'express';
import { body, param } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { resetDraw, selectRandomParticipants } from '../service/master.service';
import { participantSignIn } from '../service/participant.service';

const router = Router();

router.post(
    '/:userId/draw/:drawId/luckyDraw',
    validationMiddleware([
        param('userId').exists().not().isEmpty().withMessage('Missing User Id'),
        param('drawId').exists().not().isEmpty().withMessage('Missing Draw Id'),
        body('prizeIds')
            .exists()
            .isArray({ min: 1, max: 10 })
            .withMessage('Missing Prize ID'),
    ]),
    authMiddleware,
    async (req, res) => {
        const { userId, drawId } = req.params;
        const { prizeIds } = req.body;
        try {
            const groups = await selectRandomParticipants(
                userId,
                drawId,
                prizeIds
            );
            return res.status(200).json(groups);
        } catch (error) {
            return res.status(400).json({ msg: (error as Error).message });
        }
    }
);

router.delete(
    '/:userId/draw/:drawId/reset',
    validationMiddleware([
        param('userId').exists().not().isEmpty().withMessage('Missing User Id'),
        param('drawId').exists().not().isEmpty().withMessage('Missing Draw Id'),
    ]),
    authMiddleware,
    async (req, res) => {
        const { userId, drawId } = req.params;
        try {
            await resetDraw(userId, drawId);
            return res
                .status(200)
                .json({ success: 1, msg: 'reset draw successfully' });
        } catch (error) {
            return res.status(400).json({ msg: (error as Error).message });
        }
    }
);

router.post(
    '/:userId/draw/:drawId/signIn',
    validationMiddleware([
        param('userId').exists().not().isEmpty().withMessage('Missing User Id'),
        param('drawId').exists().not().isEmpty().withMessage('Missing Draw Id'),
        body('participantId')
            .exists()
            .not()
            .isEmpty()
            .withMessage('Missing Participant ID'),
    ]),
    async (req, res) => {
        const { drawId, userId } = req.params;
        const { participantId } = req.body;
        try {
            const participant = await participantSignIn(
                userId,
                drawId,
                participantId
            );
            return res.status(200).json(participant);
        } catch (error) {
            return res.status(400).json({ msg: (error as Error).message });
        }
    }
);

export default router;
