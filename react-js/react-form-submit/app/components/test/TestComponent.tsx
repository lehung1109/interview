const TestComponent = () => {
  const handleClick = () => {
    console.log('validation form data before submit');

    // validation code here
  };

  return (
    <form action="/api/submit-action" method="POST">
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <input type="submit" value="Submit" onClick={handleClick} />
    </form>
  );
};

export default TestComponent;