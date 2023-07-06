import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { birthChartValidationSchema } from 'validationSchema/birth-charts';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBirthCharts();
    case 'POST':
      return createBirthChart();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBirthCharts() {
    const data = await prisma.birth_chart
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'birth_chart'));
    return res.status(200).json(data);
  }

  async function createBirthChart() {
    await birthChartValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.prediction?.length > 0) {
      const create_prediction = body.prediction;
      body.prediction = {
        create: create_prediction,
      };
    } else {
      delete body.prediction;
    }
    const data = await prisma.birth_chart.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
