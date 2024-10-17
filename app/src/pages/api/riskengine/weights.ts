import type { NextApiRequest, NextApiResponse } from 'next';

import { MANAGER_ADDRESS, RPC_URL } from '@/app/constants';
import { Manager__factory as ManagerFactory } from '@/typechain';
import { JsonRpcProvider } from 'ethers';

type ResponseData = {
  weights: number[];
};

/**
 * @swagger
 * /api/riskengine/weights:
 *   get:
 *     description: Returns risk engine performance
 *     responses:
 *       200:
 *         description: Returns risk engine performance
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const {
    query: { etfIndex },
  } = req;

  if (!etfIndex) {
    res.status(500);
  }

  ManagerFactory.connect(MANAGER_ADDRESS, new JsonRpcProvider(RPC_URL))
    .getETFAssetsAtIndex(etfIndex as string)
    .then((assets) => {
      fetch(
        `http://api.umbrellafi.xyz:5000/performance?assets=${assets.join(',')}`
      )
        .then((result) => {
          if (result.status !== 200) {
            throw new Error('Internal server error');
          }

          result.text().then((data) => {
            // Return weights as 1e4
            const weights = JSON.parse(data).weights.map((w: number) =>
              Math.floor(w * 10 ** 4)
            );
            res.status(200).json({ weights });
          });
        })
        .catch(() => res.status(500));
    });
}
