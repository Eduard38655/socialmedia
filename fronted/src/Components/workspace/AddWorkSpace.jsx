import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styles from "../../Styles/GroupNavBar.module.css";
import UploadImagen from "../workspace/UploadImagen.jsx";

function AddWorkSpaces({ SetNewWorkSpace }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data);
    SetNewWorkSpace(false);
  }

  return (
    <div className={styles.AddWorkSpaces_container}>
      <aside className={styles.AddWorkSpaces}>

        {/* HEADER */}
        <div className={styles.Header_NewWorkpace}>
          <div>
            <h2>{t("AddWorkspaces")}</h2>
            <p>{t("CreateWorkspaceDesc")}</p>
          </div>

          <button type="button" onClick={() => SetNewWorkSpace(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <UploadImagen />

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className={styles.InputContainer}>
            <label>{t("WorkspaceName")}</label>

            <div className={styles.Div_Input}>
              <i className="fa-solid fa-pen"></i>

              <input
                type="text"
                placeholder={t("WorkspacePlaceholder")}
                {...register("workspaceName", {
                  required: t("NameRequired"),
                  maxLength: {
                    value: 20,
                    message: t("NameMax"),
                  },
                  minLength: {
                    value: 3,
                    message: t("NameMin"),
                  },
                })}
              />
            </div>

            {errors.workspaceName && (
              <span className={styles.error}>
                {errors.workspaceName.message}
              </span>
            )}
          </div>

          {/* BUTTONS */}
          <div className={styles.DivButtons_Opt}>
            <button type="button" onClick={() => SetNewWorkSpace(false)}>
              {t("Cancel")}
            </button>

            <button type="submit">
              {t("CreateWorkspace")}
            </button>
          </div>

        </form>
      </aside>
    </div>
  );
}

export default AddWorkSpaces;