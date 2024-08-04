
const Tooltip = ({ children, text }: { children: JSX.Element, text: string }) => {
    return (
        <div className="relative group ">
            {children}
            <div className="absolute shadow-lg left-full top-2 ml-2 hidden group-hover:block bg-white text-[#1a1a1a] text-xs rounded p-1">
                {text}
            </div>
        </div>
    );
};

export default Tooltip;