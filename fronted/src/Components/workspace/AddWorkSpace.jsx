

function AddWorkSpaces({ SetNewWorkSpace }) {
    return (<div>



        <div>

            <div>
                <p>AddWorkSpaces
                    <br /> <span> Crea un nuevo lugar para que tu equipo colabore.</span></p>

                <button onClick={() => { SetNewWorkSpace(false) }}>x </button>
            </div>

            <label htmlFor="">Nombre del espacio</label>
            <input type="text" placeholder="Ej. Marketing, Sales..." />

            <div>
                <button onClick={() => { SetNewWorkSpace(false) }}>Cancel</button>
                <button>Crear Spacio</button>
            </div>
        </div>
    </div>)
}

export default AddWorkSpaces