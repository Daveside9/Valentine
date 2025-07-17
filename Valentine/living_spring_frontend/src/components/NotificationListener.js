useEffect(() => {
  const fetchMessage = async () => {
    console.log('Fetching global message...');
    const res = await fetch("http://127.0.0.1:5000/api/global-message");
    const data = await res.json();
    console.log('Got message:', data);
    const stored = localStorage.getItem("last_read");
    console.log('Last read timestamp:', stored);

    if (
      data.message &&
      (!stored || new Date(data.timestamp) > new Date(stored))
    ) {
      console.log('Showing new message popup');
      setMessage(data.message);
      setVisible(true);
    }
  };
  fetchMessage();
}, []);
