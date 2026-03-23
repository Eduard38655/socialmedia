import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Context/ThemeContext.jsx";
import styles from "../Styles/Settings.module.css";

export default function SettingsPage({ setShowProfile }) {
    const { theme, setTheme } = useContext(ThemeContext);
    const { t, i18n } = useTranslation();

    return (
        <div className={styles.app}>
            <article className={styles.app_Container}>

                {/* SIDEBAR */}
                <aside className={styles.sidebar}>
                    <div>
                        <h1>{t("Settings")}</h1>
                        <p>{t("ManagePreferences")}</p>

                        <div className={styles.nav}>
                            <div onClick={() => setShowProfile(false)} className={styles.navItem}>
                                🏘️ {t("Home")}
                            </div>

                            <div className={styles.navItem}>
                                👤 {t("Profile")}
                            </div>

                            <div className={styles.navItem}>
                                🎨 {t("Appearance")}
                            </div>

                            <div className={styles.navItem}>
                                🌐 {t("Language")}
                            </div>
                            <div  className={styles.navItem}>
                            🚪 {t("Logout")}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <main className={styles.main}>
                    <h2>{t("ProfilePreferences")}</h2>
                    <p className={styles.subtitle}>
                        {t("CustomizeAccount")}
                    </p>

                    {/* PERSONAL DETAILS */}
                    <div className={styles.section}>
                        <div className={styles.left}>
                            <h3>{t("PersonalDetails")}</h3>
                            <p>{t("UpdateInfo")}</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.grid}>
                                <input placeholder={t("FullName")} defaultValue="Alex Sterling" />
                                <input placeholder={t("Email")} defaultValue="alex.sterling@atrium.com" />
                                <input className={styles.full} placeholder={t("Phone")} />
                                <textarea className={styles.full} placeholder={t("Bio")}></textarea>
                            </div>

                            <button className={styles.btn}>
                                {t("SaveChanges")}
                            </button>
                        </div>
                    </div>

                    {/* APPEARANCE */}
                    <div className={styles.section}>
                        <div className={styles.left}>
                            <h3>{t("Appearance")}</h3>
                            <p>{t("ChooseTheme")}</p>
                        </div>

                        <div className={styles.themes}>
                            <div
                                onClick={() => setTheme("light")}
                                className={`${styles.theme} ${theme === "light" ? styles.active : ""}`}
                            >
                                {t("Light")}
                            </div>

                            <div
                                onClick={() => setTheme("dark")}
                                className={`${styles.theme} ${theme === "dark" ? styles.active : ""}`}
                            >
                                {t("Dark")}
                            </div>

                            
                        </div>
                    </div>

                    {/* LANGUAGE */}
                    <div className={styles.section}>
                        <div className={styles.left}>
                            <h3>{t("Language")}</h3>
                            <p>{t("SelectLanguage")}</p>
                        </div>

                        <div className={styles.card}>
                            <div
                                onClick={() => i18n.changeLanguage("en")}
                                className={`${styles.lang} ${i18n.language === "en" ? styles.active : ""}`}
                            >
                                {t("English")}
                            </div>

                            <div
                                onClick={() => i18n.changeLanguage("es")}
                                className={`${styles.lang} ${i18n.language === "es" ? styles.active : ""}`}
                            >
                                {t("Spanish")}
                            </div>
                        </div>
                    </div>

                </main>
            </article>
        </div>
    );
}