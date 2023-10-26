
import './Spinner.css';
import MoonLoader from "react-spinners/MoonLoader";

export default function TransactionSpinner({ loading }) {
    return (
        <div className="transaction-spinner my-4">
            {loading && (
                <>
                <MoonLoader color="rgba(54, 142, 214, 1)" 
                size={50}/>
                </>
            ) }
            </div>
    );
}