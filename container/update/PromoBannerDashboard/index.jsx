import { useMutation, useQuery } from "@apollo/client";
import { InputHooks, RippleButton, motion } from "pkg-components";
import { PColor } from "public/colors";
import { useState } from "react";
import styles from "./banners.module.css";
import {
    CREATE_BANNER_PROMO_DASHBOARD,
    GET_BANNER_PROMO_DASHBOARD,
} from "./queries";
export const PromoBannerDashboard = () => {
  // ------------ ESTADOS ------------
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  //-----------QUERIES ------------
  const [createAPromoBanner] = useMutation(CREATE_BANNER_PROMO_DASHBOARD);
  const { data } = useQuery(GET_BANNER_PROMO_DASHBOARD, {
    // context: { clientName: "admin-master" }
  });
  // ------------ HANDLES ------------
  const handleChange = (e, error) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: error });
  };
  // Contexto de las notificaciones
  const handleRegister = async (e) => {
    e.preventDefault();
    const { comments, metaTags, mainName } = values;
    try {
      createAPromoBanner({
        variables: {
          input: {
            comments,
            metaTags,
            mainName,
            urlImage: "",
            bPromoState: 1,
          },
        },
      }).catch((err) => console.log({ message: `${err}`, duration: 7000 }));
    } catch (error) {
      console.log({ message: `${error.message}`, duration: 7000 });
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const onDelete = () => {};
  const handleDeleteClick = (id) => {
    if (deleteDialogOpen === id) {
      setDeleteDialogOpen(false);
      return;
    }
    setDeleteDialogOpen(id);
  };
  const handleDeleteConfirm = () => {
    onDelete(data.id); // Llama a la función de eliminación con el ID del elemento
    setDeleteDialogOpen(false);
  };

  const onUpdate = () => {
    setDeleteDialogOpen(false);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <InputHooks
          title="nombre"
          type="text"
          value={values.mainName}
          name="mainName"
          required
          onChange={handleChange}
          range={{ min: 0, max: 180 }}
        />
        <InputHooks
          title="Meta tags"
          value={values.metaTags}
          name="metaTags"
          required
          onChange={handleChange}
          range={{ min: 0, max: 180 }}
        />
        <InputHooks
          title="Comentarios"
          value={values.comments}
          name="comments"
          required
          onChange={handleChange}
          range={{ min: 0, max: 180 }}
        />
        <RippleButton
          widthButton="100%"
          margin="20px auto"
          type="submit"
          bgColor={PColor}
        >
          Subir
        </RippleButton>
      </form>
      <div className={styles.wrapperContainer}>
        {data?.getPromoStoreAdmin.map((x) => (
          <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
            className={styles.container}
            key={x.pSoId}
          >
            <h2 className={styles.title}>{x.mainName}</h2>
            <p className={styles.comments}>{x.comments}</p>
            <p className={styles.metaTags}>{x.metaTags}</p>
            <div className={styles.actions}>
              <button className={`${styles.editButton}`} onClick={onUpdate}>
                Editar
              </button>
              <button
                className={`${styles.deleteButton}`}
                onClick={() => handleDeleteClick(x.pSoId)}
              >
                Eliminar
              </button>
            </div>

            {deleteDialogOpen === x.pSoId && (
              <div className={styles.deleteDialog}>
                <h3>Confirmar eliminación</h3>
                <p>¿Estás seguro de que deseas eliminar este elemento?</p>
                <div className={styles.deleteButtons}>
                  <button
                    className={`${styles.editButton}`}
                    onClick={handleDeleteCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    className={`${styles.deleteButton}`}
                    onClick={handleDeleteConfirm}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
