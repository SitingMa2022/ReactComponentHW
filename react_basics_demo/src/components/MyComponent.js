import { useState, useEffect } from "react";

export default function MyComponent() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [delay, setDelay] = useState(0);

    const [loadingState, setLoadingState] = useState(true);
    const [errorState, setErrorState] = useState(false);

    const [loadingTime, setLoadingTime] = useState(0);

    useEffect(() => {
        fetchData();
    }, [delay]);

    async function fetchData() {
        setLoadingState(true);
        const timeLoadingStart = new Date();
        const response = await fetch(`https://reqres.in/api/users?delay=${delay}`);
        const json = await response.json();
        setData(json.data);
        const timeLoadingEnd = new Date();
        setErrorState((timeLoadingEnd - timeLoadingStart <= 3000) ? false : true);
        setLoadingTime((timeLoadingEnd - timeLoadingStart) / 1000);
        setLoadingState(false);
    }

    async function changeGlobalFilter(args) {
        setGlobalFilter(args.target.value)
    }

    const filteredData = data.filter(
        (data) => data.first_name.includes(globalFilter) || data.last_name.includes(globalFilter) || data.email.includes(globalFilter)
    );

    return (
        <div>
            <h1>My Component to Render Images</h1>
            <label key="globalFilter">global filter (by name or by email): </label>
            <input type="text" id="globalFilter" value={globalFilter} onChange={changeGlobalFilter} />
            <label key="button">button: </label>
            <button onClick={() => setDelay(5)}>set 5s delay</button>
            <br />
            {loadingState ? (
                <p>loading...</p>
            ) : errorState ? (
                <p>Time out error: loading time greater than 3s. Actual loading time: {loadingTime}s</p>
            ) : (
                <ul>
                    {filteredData.map((data) => (
                        <li key={data.id}>{data.first_name} {data.last_name} {data.email} <img src={data.avatar} alt={`${data.first_name} ${data.last_name}`} /></li>
                    ))}
                    <p>Actual loading time: {loadingTime}s</p>
                </ul>
            )}
        </div>
    );
}