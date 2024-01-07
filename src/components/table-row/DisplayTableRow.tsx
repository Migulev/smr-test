type Props = {
  folderCellView: JSX.Element;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  onEdit: () => void;
};

//****************//
function DisplayTableRow({
  onEdit,
  folderCellView,
  rowName,
  salary,
  equipmentCosts,
  overheads,
  estimatedProfit,
}: Props) {
  return (
    <tr onDoubleClick={() => onEdit()}>
      <td>{folderCellView}</td>
      <td>{rowName}</td>
      <td>{salary}</td>
      <td>{equipmentCosts}</td>
      <td>{overheads}</td>
      <td>{estimatedProfit}</td>
    </tr>
  );
}

export default DisplayTableRow;
