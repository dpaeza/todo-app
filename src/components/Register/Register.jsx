import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate} from "react-router-dom";
import { registeredUser, postUser } from "../../services/users";
import { postNewUserList } from "../../services/to_do_lists";
import Swal from "sweetalert2";

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({});
    const navigate = useNavigate();

    const onSubmitSigin = async (data) => {
        console.log(data)
        try {
            const check = await registeredUser(data.user);
            console.log(check)
            if (check.length > 0) {
                Swal.fire({
                    icon: "error",
                    iconColor: "#f63d5d",
                    background: "white",
                    color: "black",
                    text: "El usuario ingresado ya tiene una cuenta, si pertenece a ti inicia sesión, sino registrate con otro nombre de usuario.",
                });
            } else {
                try {
                    const response = await postUser(data);
                    if (response.status == 201) {
                        await postNewUserList({
                            id_user: response.data.id,
                            list: []
                        })
                        Swal.fire({
                            icon: "success",
                            iconColor: "#f63d5d",
                            background: "white",
                            color: "black",
                            text: "Usuario registrado con exito!, inicia sesión",
                        }); 
                        navigate("/");
                    } else {
                        Swal.fire({
                            icon: "error",
                            iconColor: "#f63d5d",
                            background: "white",
                            color: "black",
                            text: "Lo sentimos, hubo un error al procesar la solicitud, intenta de nuevo.",
                        }); 
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        iconColor: "#f63d5d",
                        background: "white",
                        color: "black",
                        text: "Lo sentimos, hubo un error al procesar la solicitud, intenta de nuevo.",
                    }); 
                }
            }
        } catch (error) {
            Swal.fire({
                    icon: "error",
                    iconColor: "#f63d5d",
                    background: "white",
                    color: "black",
                    text: "Lo sentimos, hubo un error al procesar la solicitud, intenta de nuevo.",
            });            
        }
    }

    return (
        <section className="loginPage">
            <section className="loginPage__modal">
                <h1>REGISTRATE</h1>
                <form onSubmit={handleSubmit(onSubmitSigin)} className="loginPage__Form">
                    <div>
                        <label>Usuario:</label>
                        <input type="text"
                            placeholder="Ingresa un usuario"
                            {...register("user", { 
                                required: {
                                    value: true,
                                    message: 'El usuario es requerido.'
                                }
                            })}
                        />
                        { errors.user ? <span className="loginPage__errors">{errors.user.message}</span> : <></>}
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Ingresa una contraseña"
                            {...register("password", { 
                                required: {
                                    value: true,
                                    message: 'La contraseña es requerida.'
                                }
                            })}
                        />
                        {errors.password ? <span className="loginPage__errors">{errors.password.message}</span> : <></>}
                    </div>
                    {/* <div>
                        <label>URL imagen de perfil</label>
                        <input
                            type="url"
                            placeholder="Ingresa la URL de tu imagen de perfil"
                            {...register("profile_image", { 
                                required: {
                                    value: true,
                                    message: 'La imagen de perfil es requerida.'
                                }
                            })}
                        />
                        {errors.password ? <span className="loginPage__errors">{errors.profile_image.message}</span> : <></>}
                    </div> */}
                    <button type="submit">Registrar</button>
                </form>
                <p>¿Ya te encuentras registrado? 
                    <Link to={"/"}> Inicia sesión</Link>
                </p>
            </section>
        </section>
    )
}

export default Register