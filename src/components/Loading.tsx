const Loading: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center gap-2">
            {/* @ts-ignore */}
            <Spinner size="3" />
            <div className="text-md font-medium">Loading...</div>
        </div>
    );
};

export default Loading