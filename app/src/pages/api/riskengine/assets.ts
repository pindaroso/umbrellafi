import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  weights: object;
  sharpeRatio: number;
  expectedAnnualReturn: number;
  annualVolatility: number;
};

/**
 * @swagger
 * /api/riskengine/assets:
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
    query: { assets },
  } = req;

  if (!assets) {
    res.status(500);
  }

  fetch(`http://api.umbrellafi.xyz:5000/performance?assets=${assets}`)
    .then((result) => {
      if (result.status !== 200) {
        throw new Error('Internal server error');
      }

      result.text().then((data) => {
        res.status(200).json(JSON.parse(data));
      });
    })
    .catch(() => res.status(500));
}
