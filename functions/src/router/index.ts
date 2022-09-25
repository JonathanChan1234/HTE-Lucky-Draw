import { Router } from 'express';
import { body, param } from 'express-validator';
import validationMiddleware from '../middleware';
import { participantSignIn } from '../service/participant.service';

const router = Router();

router.post(
    '/:userId/draws/:drawId/signIn',
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
