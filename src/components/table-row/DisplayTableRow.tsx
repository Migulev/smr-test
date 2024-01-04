type Props = {
  folderCellView: any;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  onEdit: () => void;
};

//****************//
function DisplayTableRow(props: Props) {
  return (
    <tr onDoubleClick={() => props.onEdit()}>
      <td>{props.folderCellView}</td>
      <td>{props.rowName}</td>
      <td>{props.salary}</td>
      <td>{props.equipmentCosts}</td>
      <td>{props.overheads}</td>
      <td>{props.estimatedProfit}</td>
    </tr>
  );
}

export default DisplayTableRow;
