const replaceNewLine: React.FC<{ str: string }> = ({ str }) => {
    const lines = str.split("\n");
    const components = lines.map((item, i) => {
        return (
            <>
                {item}
                {i != lines.length && <br />}
            </>
        );
    });
    return <>{components};</>;
};

export default replaceNewLine
