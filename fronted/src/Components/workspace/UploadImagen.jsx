import styles from "../../Styles/GroupNavBar.module.css";
function UploadImagen(params) {

    return (<>
        <div className={styles.UploadImagen}>
            <i className="fa-solid fa-arrow-up-from-bracket"></i>
            <span>Formats : JPG, PNG. Máx 2MB.</span>
        </div>

    </>)
}


export default UploadImagen