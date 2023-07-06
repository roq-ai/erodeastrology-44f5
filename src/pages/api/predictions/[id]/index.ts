import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { predictionValidationSchema } from 'validationSchema/predictions';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.prediction
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPredictionById();
    case 'PUT':
      return updatePredictionById();
    case 'DELETE':
      return deletePredictionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPredictionById() {
    const data = await prisma.prediction.findFirst(convertQueryToPrismaUtil(req.query, 'prediction'));
    return res.status(200).json(data);
  }

  async function updatePredictionById() {
    await predictionValidationSchema.validate(req.body);
    const data = await prisma.prediction.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePredictionById() {
    const data = await prisma.prediction.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
