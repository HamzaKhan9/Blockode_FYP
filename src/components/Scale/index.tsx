interface Props {
  length: number;
  horizontal?: boolean;
  gap?: number;
}

function Scale({ horizontal = true, gap = 30, length }: Props) {
  const total = length / gap;

  return (
    <div
      style={{
        width: horizontal ? length : undefined,
        height: horizontal ? undefined : length,
        position: "absolute",
        bottom: horizontal ? 0 : undefined,
        left: horizontal ? undefined : 0,
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
      }}
    >
      {Array(total)
        .fill(0)
        .map((_, ix) => {
          return (
            <div
              className="border-white text-white"
              key={ix}
              style={{
                height: horizontal ? 12 : gap,
                borderLeftWidth: horizontal ? 1 : undefined,
                borderTopWidth: horizontal ? undefined : 1,
                fontSize: 9,
                width: horizontal ? gap : 12,
                paddingLeft: 2,
              }}
            >
              <span>{horizontal ? ix * gap : (total - ix) * gap}</span>
            </div>
          );
        })}
    </div>
  );
}

export default Scale;
