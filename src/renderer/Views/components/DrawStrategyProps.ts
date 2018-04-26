import { Description } from "../../../common/Descriptions"

type DrawStrategyProps = {
    description: Description,
    id: number,
    selected: boolean,
    onSelect: (id: number) => void,
    onDoubleClick: (id: number) => void,
    showHidden: boolean
}

export default DrawStrategyProps;