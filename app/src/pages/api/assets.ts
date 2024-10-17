import type { NextApiRequest, NextApiResponse } from 'next';

import * as manifest from '../../manifest.json';

type ResponseData = {
  assets: string[];
};

/**
 * @swagger
 * /api/assets:
 *   get:
 *     description: Returns risk engine assets
 *     responses:
 *       200:
 *         description: Returns risk engine assets
 */
function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { assets } = manifest;
  res.status(200).json({ assets });
}

export default handler;
