import * as React from 'react';
import type { PortInfo } from 'main/preload';

export default function ScaleSettingPage() {
  const [ports, setPorts] = React.useState<PortInfo[]>([]);
  const interval = React.useRef<NodeJS.Timer>();
  React.useEffect(() => {
    interval.current = setInterval(async () => {
      const result = await window.electron.getSerialPorts();
      setPorts(result);
    }, 2000);
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <ul>
      <li role="presentation">ports</li>
      {ports.map((p) => (
        <li key={p.path}>{p.path}</li>
      ))}
    </ul>
  );
}
