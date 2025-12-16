const Result = ({ data, search }: { data?: string[], search?: string }) => {
  return (
    <div className="mt-4">
      <p className="">You searched for: {search || "undefined"}</p>

      <p className="mt-4">Found {data?.length || 0} results</p>
      <ul>
        {data?.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default Result;