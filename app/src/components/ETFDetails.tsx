import { concatEthereumAddress, formatAsset } from '@/app/helpers';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ETFDetails = ({ etf: etf }: { etf: any }) => {
  return (
    <>
      <div className="flex justify-between text-tiny text-gray-400">
        <div>Token Address</div>
        <div className="text-gray-300 flex">
          <code className="">
            {etf && etf.token.address.length
              ? concatEthereumAddress(etf.token.address)
              : '-'}
          </code>
          <FaExternalLinkAlt
            className="ml-1"
            style={{ paddingTop: '3px ' }}
            size={12}
          />
        </div>
      </div>
      <div className="flex justify-between text-tiny text-gray-400">
        <div>Portfolio Assets</div>
        <div className="text-gray-300">
          {etf ? etf.assets.map(formatAsset).join(', ') : '-'}
        </div>
      </div>
      <div className="flex justify-between text-tiny text-gray-400">
        <div>Expected Annual Return</div>
        <div className="text-green-400">
          {etf && etf.performance.expectedAnnualReturn
            ? (etf.performance.expectedAnnualReturn * 100).toFixed(2) + '%'
            : '-'}
        </div>
      </div>
      <div className="flex justify-between text-tiny text-gray-400">
        <div>Annual Volatility</div>
        <div className="text-red-400">
          {etf && etf.performance.annualVolatility
            ? (etf.performance.annualVolatility * 100).toFixed(2) + '%'
            : '-'}
        </div>
      </div>
      <div className="flex justify-between text-tiny text-gray-400">
        <div>Sharpe Ratio</div>
        <div className="text-gray-300">
          {etf && etf.performance.sharpeRatio
            ? etf.performance.sharpeRatio.toFixed(2)
            : '-'}
        </div>
      </div>
      <div className="flex justify-between text-tiny text-gray-400">
        <div>Fee</div>
        <div className="text-gray-300">{etf ? etf.fee + ' bps' : '-'}</div>
      </div>
    </>
  );
};

export default ETFDetails;
