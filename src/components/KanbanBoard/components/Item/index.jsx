export default function Item(props) {
  const { id, data } = props;

  const wrapperStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'center',
    border: '1px solid #30363d',
    borderRadius: '10px',
    margin: '10px 0',
    background: '#1e1e1e',
    cursor: 'grab',
    flexDirection: 'column',
  };

  const titleStyle = {
    padding: '10px 10px 0px 10px',
    margin: 0,
  };

  const descriptionStyle = {
    ...titleStyle,
    fontSize: '14px',
  };

  const authorStyle = {
    ...titleStyle,
    fontSize: '12px',
    fontStyle: 'italic',
    paddingBottom: '10px',
  };

  return (
    <div style={wrapperStyle}>
      <h3 style={titleStyle}>{data?.title}</h3>
      <p style={descriptionStyle}>{data?.description}</p>
      <p style={authorStyle}>#{data?.author}</p>
    </div>
  );
}
