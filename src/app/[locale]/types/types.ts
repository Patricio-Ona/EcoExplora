// CREATE TABLE ValorNutricional (
//     ValorNutricionalID INT PRIMARY KEY IDENTITY,
//     PlantaID INT FOREIGN KEY REFERENCES Planta(PlantaID),
//     Calorias DECIMAL(10,2),
//     Proteinas DECIMAL(10,2),
//     Grasas DECIMAL(10,2),
//     Carbohidratos DECIMAL(10,2),
//     Fibra DECIMAL(10,2),
//     Vitaminas NVARCHAR(255)
// );

export interface ValorNutricional {
    ValorNutricionalID: number
    PlantaID: number
    Calorias: number
    Proteinas: number
    Grasas: number
    Carbohidratos: number
    Fibra: number
    Vitaminas: string
}

// CREATE TABLE Planta (
//     PlantaID INT PRIMARY KEY IDENTITY,
//     NombreComun NVARCHAR(100),
//     NombreCientifico NVARCHAR(100),
//     CategoriaID INT FOREIGN KEY REFERENCES CategoriaPlanta(CategoriaID),
//     ZonaID INT FOREIGN KEY REFERENCES ZonaCultivo(ZonaID),
//     Descripcion NVARCHAR(MAX),
//     ImagenURL NVARCHAR(255),
//     FechaRegistro DATETIME DEFAULT GETDATE(),
//     UsuarioID INT FOREIGN KEY REFERENCES Usuario(UsuarioID),
//     VecesConsumida INT DEFAULT 0
// );
export interface Planta {
    PlantaID: number
    NombreComun: string
    NombreCientifico: string
    Categoria: string
    Zona: string
    ImagenURL: string

}
export interface PlantaSola {
    PlantaID: number
    NombreComun: string
    NombreCientifico: string
    CategoriaID: number
    ZonaID: number
    Descripcion: string
    ImagenURL: string
    FechaRegistro: string // ISO date string (puedes usar Date si lo vas a convertir)
    UsuarioID: number
    VecesConsumida: number
    Categoria: string
    Zona: string
    UsuarioRegistro: string
}
export interface Foro {
    ForoID: number
    Comentario: string
    ImagenURL: string
    Latitud: string // Puedes cambiar a number si lo conviertes al usarlo
    Longitud: string // Idem
    FechaPublicacion: string // ISO string, o Date si lo parseas
    Usuario: string
    Planta: string
}

// CREATE TABLE Receta (
//     RecetaID INT PRIMARY KEY IDENTITY,
//     Nombre NVARCHAR(150) NOT NULL,
//     Descripcion NVARCHAR(MAX),
//     Instrucciones NVARCHAR(MAX),
//     UsuarioID INT FOREIGN KEY REFERENCES Usuario(UsuarioID),
//     FechaRegistro DATETIME DEFAULT GETDATE()
// );

export interface Receta {
    RecetaID: number
    Nombre: string
    Descripcion: string
    Instrucciones: string
    FechaRegistro: Date
    Usuario: string
}
