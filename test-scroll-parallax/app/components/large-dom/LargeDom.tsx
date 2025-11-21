const LargeDom = () => {
  return (
    <div className="max-h-[500px] overflow-y-auto">
      <h1>Large DOM</h1>

      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
      <div>
        <div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>

        {Array.from({ length: 100 }, (_, i) => (
          <div key={i}>
            <h2>Section {i + 1}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Pellentesque vitae velit ex. Mauris dapibus risus quis suscipit vulputate.
              Egestas velit, nec luctus ligula commodo sed. Integer facilisis.
            </p>
            <ul>
              {Array.from({ length: 10 }, (_, j) => (
                <li key={j}>Item {j + 1} in Section {i + 1}</li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
};

export default LargeDom;