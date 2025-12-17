import { useEffect } from "react";

const Test = () => {
  // declare a function that use in use Effect
  const testFunction = () => {
    // hundred lines of code here
  };
  
  useEffect(() => {
    testFunction();
  }, []);

  return (<>
    {/* Some html code */}
  </>);
}

export default Test;