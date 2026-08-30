import DetailActions from "../DetailActions";
import type { DetailActionsProps } from "../../types";

export default function DesktopDetailActions(props: DetailActionsProps) {
  return (
    <div className="hidden pt-8 lg:block">
      <DetailActions {...props} />
    </div>
  );
}
