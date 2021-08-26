import { FC, useEffect } from 'react';

type AgentIdsType = {
  [key: string]: string;
};

const LICENSE_KEY = 'NRJS-d190c88daa27d216f3e';
const ACCOUNT_ID = '2921752';
const AGENT_IDS: AgentIdsType = {
  'dev.contrib.org': '1108663362',
  'live.contrib.org': '1108706736',
  'contrib.org': '1108706736',
};

const NewRelicInitializer: FC = () => {
  useEffect(() => {
    if (process.env.REACT_APP_USE_NEWRELIC !== 'true') {
      return;
    }

    const platformUrl = new URL(process.env.REACT_APP_PLATFORM_URL || '');
    const agentId = AGENT_IDS[platformUrl.hostname];

    if (!agentId) {
      return;
    }

    const w = window as any;

    w.NREUM.loader_config = {
      accountID: ACCOUNT_ID,
      trustKey: ACCOUNT_ID,
      agentID: agentId,
      licenseKey: LICENSE_KEY,
      applicationID: agentId,
    };
    w.NREUM.info = {
      beacon: 'bam.nr-data.net',
      errorBeacon: 'bam.nr-data.net',
      licenseKey: LICENSE_KEY,
      applicationID: agentId,
      sa: 1,
    };
  }, []);

  return null;
};

export default NewRelicInitializer;
