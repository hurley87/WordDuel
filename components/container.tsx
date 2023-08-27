export const Container = ({ children }) => {
  return (
    <div className="'flex items-center justify-center [&>div]:w-full">
      {children}
    </div>
  );
};
