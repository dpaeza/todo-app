import React from "react";
import { useForm } from "react-hook-form";
import { getUser } from "../../services/users";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({});
    const navigate = useNavigate();

    const onSubmitLogin = async (data) => {
        console.log(data)
        try {
            const response = await getUser(data.user, data.password);
            if (response.length > 0) {
                navigate("/home" , { state: response[0].id});
            } else {
                Swal.fire({
                    icon: "error",
                    iconColor: "#f63d5d",
                    background: "white",
                    color: "black",
                    text: "Usuario o contraseña incorrecta.",
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

    return (
        <section className="loginPage">
            <section className="loginPage__modal">
                <h1>INICIAR SESIÓN</h1>
                <form onSubmit={handleSubmit(onSubmitLogin)} className="loginPage__Form">
                    <div>
                        <label>Usuario:</label>
                        <input type="text"
                            placeholder="Ingresa tu usuario"
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
                            placeholder="Ingresa tu contraseña"
                            {...register("password", { 
                                required: {
                                    value: true,
                                    message: 'La contraseña es requerida.'
                                }
                            })}
                        />
                        {errors.password ? <span className="loginPage__errors">{errors.password.message}</span> : <></>}
                    </div>
                    <button type="submit">Iniciar sesión</button>
                </form>
                <p>¿No tienes una cuenta? 
                    <Link to={"/register"}> Registrate</Link>
                </p>
            </section>
        </section>
    )
}

export default Login