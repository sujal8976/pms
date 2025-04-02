import Sidebar from "./components/layout/sidebar";
import Signup from "./pages/auth/signup";
import Provider from "./provider";

function App() {
  return (
    <>
      <Provider>
        <div className="">
          <Sidebar />
          <Signup />
        </div>
      </Provider>
    </>
  );
}

export default App;
