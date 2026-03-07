import type { LoadCase } from '@/lib/beams/simpleBeam';
import { BeamSvg } from '@/lib/diagrams/tools/beam';

interface Props {
  loadCase: LoadCase;
  spanLabel?: string;
  loadLabel?: string;
}

export default function BeamDiagram({ loadCase, spanLabel, loadLabel }: Props) {
  return <BeamSvg loadCase={loadCase} spanLabel={spanLabel} loadLabel={loadLabel} />;
}
