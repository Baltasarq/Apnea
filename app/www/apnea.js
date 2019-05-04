// Apnea (c) Baltasar 2019 MIT License <baltasarq@gmail.com>

/* Apnea
 *  An interactive story based on sleeping apnea.
 * 
 *  Scene 1: something repetitive happens: you left a room just
 *            to get to the same room again and again.
 *
 *  Scene 2: a swimmer swims and walks through islands,
 *           suddenly in one of them it falls into a tunnel which
 *           becomes more and more narrow.
 *            
 *  Scene 3: you wake up gasping for air,
 *           after being trapped in a vertical tunnel.
 */


ctrl.setTitle( "Apnea" );
ctrl.setIntro( "Un onírico relato interactivo." );
ctrl.setPic( "res/island.jpg" );
ctrl.setAuthor( "baltasarq@gmail.com" );
ctrl.setVersion( "1.0 20190503" );

// Scenes ------------------------------------------------------------
// -------------------------------------------------------------- Room
const locRoom = ctrl.places.creaLoc(
    "Habitación", ["habitacion", "sala", "prision", "estancia"],
    "Un ${televisor, ex tv} muy viejo, \
    un ${gran sillón, ex sillon}, \
    ${una mesa decrépita, ex mesa}, \
    ${un armario, ex armario},\
    y una gran ${ventana, ex ventana} \
    que apenas permite pasar algo de luz desde el exterior completan \
    la escena entre ${desnudas paredes, ex paredes}, \
    contra las que descansa un ${armario, ex armario}. \
    La luz crea varios ${haces de polvo en suspensión, ex polvo} que, \
    de forma hipnótica, puedes atravesar con las manos para observar \
    cómo vuelven a formarse de nuevo. <br/>\
    Puedo ver ${un dintel, ex dintel} que invita a ${salir, n} de aquí."
);
locRoom.pic = "res/room.jpg";
locRoom.setExit( "norte", locRoom );
locRoom.dejaVuMsgs = new MsgList( [
    "¿Pero... qué ha pasado? ¡Si estoy en el mismo lugar!",
    "Y de nuevo... en el mismo sitio.",
    "La frustración crece en mi. ¿No hay salida?",
    "Intento encontrar una explicación para todo esto, pero...",
    "Y de nuevo, lo mismo...",
    "No puede ser, no puede ser... otra vez igual.",
    "De nuevo lo mismo. ¿Es esto un <i>déja vú</i>?",
    "Empiezo a notar un sudor frío al temer que esto no tendrá fin...",
    "Otra vez... otra vez... miro tras de mi, seguro de encontrar \
     el dintel que acabo de atravesar, pero... no hay nada... \
     la única salida, igual que antes, está delante de mi.",
    "Sé que acabo de atraversar el dintel, \
     aunque no puedo distinguir nada al intentar mirar \
     a través de ella. Estoy atrapado.",
    "¿Estoy atrapado en esta habitacion para siempre? ¡Atrapado!",
    "Y otra vez lo mismo... vuelvo a estar... aquí."
] );

locRoom.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() < 1 ) {
        toret = "Respiro. Inspiro. Respiro e inspiro otra vez. \
        Respiro de nuevo, y abro los ojos. \
        Una sensación de desasosiego me inunda, \
        pues me rodea una extraña habitación, oscura, polvorienta, \
        vieja. Hay algo extraño en este lugar, \
        algo que me repele y me atrae al mismo tiempo, \
        me hace sentir en casa y en un lugar extraño. \
        Camino en derredor de la mesa, \
        mediante la poca luz disponible. ¿Qué es este lugar?"
        + "<br/>" + toret;
    }
    
    if ( objWardrobe.pushed ) {
        toret += "<br/>En el lugar ocupado antes por \
                    el armario que desplacé, \
                    puedo ver un agujero \
                    en la pared, parece el comienzo de un \
                    ${túnel, sal}.";
    } else {
        if ( locRoom.getTimesExamined() < 2 ) {
            ctrl.print("No sé cuál es el propósito \
                        de esta estancia, \
                        si bien sé... o siento, mejor dicho, \
                        que debo salir de aquí.");
        }
    }
    
    return toret;
}

locRoom.preGo = function() {
    const s = parser.sentence;
    let toret = "";
    
    if ( s.term1 == "norte" ) {
        toret = locRoom.dejaVuMsgs.nextMsg();
    }
    
    objWardrobe.pushed = false;
    goAction.exe( s );
    ctrl.print( "Has salido por la puerta y..." );
    
    return toret;
};

locRoom.preExit = function() {
    toret = "Me introduje en el agujero para arrastrarme \
            por un hueco polvoriento. \
            Al poco de acomodarme para avanzar, \
            comencé a notar a continuación \
            cómo era succionado dejando atrás aquellas paredes, \
            siendo arrastrado hacia adelante irresistiblemente. \
            <br/>Buscando en derredor... no existe ahora \
            rastro alguno del túnel que acabo de dejar.";
    
    ctrl.goto( locSea );
    return toret;
}

const objReloj = ctrl.creaObj(
    "reloj", [],
    "Un reloj digital con cronómetro para nadadores. ",
    locRoom,
    Ent.Portable
);

objReloj.preExamine = function() {
    let toret = this.desc;
    
    h = Math.floor( Math.random() * 24 );
    m = Math.floor( Math.random() * 60 );
    
    toret += "Marca las " + ( '00' + h ).substr(-2)
                + ":" + ( '00' + m ).substr(-2) + ".";
    
    return toret;
};

const objDoor = ctrl.creaObj(
    "puerta", [ "dintel" ],
    "Por alguna razón, el lugar donde debería haber una puerta \
     es tan solo un dintel vacío. Es obvio que es una salida, \
     aunque extrañamente oscura. No puedes ver en su interior.",
    locRoom,
    Ent.Scenery
);

const objSillon = ctrl.creaObj(
    "sillón", [ "sillon", "butaca" ],
    "Estratégicamente colocado frente a la ${\"tele\", ex tv}.",
    locRoom,
    Ent.Scenery
);

const objTv = ctrl.creaObj(
    "televisor", [ "television", "pantalla", "tv", "tele" ],
    "Antigua tecnología de tubo de rayos catódicos.",
    locRoom,
    Ent.Scenery
);

const objMesa = ctrl.creaObj(
    "mesa", [ "mesita" ],
    "Una pequeña mesa que parece amenazar con venirse abajo \
     en cualquier momento.",
    locRoom,
    Ent.Scenery
);

const objPolvo = ctrl.creaObj(
    "polvo", [ "haz", "haces" ],
    "Los haces de luz muestran remolinos de polvo que se hacen \
     y se deshacen a medida que agitas tu mano, para volver a ser \
     sustituidos por un camino completo que parte de la ventana \
     para perderse en el suelo. ",
    locRoom,
    Ent.Scenery
);

const objWindow = ctrl.creaObj(
    "ventana", ["ventana", "cristal", "ventanal" ],
    "Un gran ventanal. Supones que podría ${abrirse, abre ventana}.",
    locRoom,
    Ent.Scenery
);

objWindow.preOpen = function() {
    return "Pero... es... curioso. Extraño. \
            No se aprecian pestillos ni cerrojos.";
};

const objWalls = ctrl.creaObj(
    "paredes", ["pared", "muro", "muros"],
    "Las paredes son oscuras, negruzcas y... lejanas.",
    locRoom,
    Ent.Scenery
);

const objWardrobe = ctrl.creaObj(
    "armario", [],
    "Viejo y desportillado, apoyado contra la pared. \
    Sus puertas aún pueden ${abrirse, abre armario}.",
    locRoom,
    Ent.Scenery
);

objWardrobe.pushed = false

objWardrobe.preOpen = function() {
    return "Abro las puertas con cuidado, \
    arremolinando gran cantidad de polvo en suspensión en el proceso. \
    Pero está vacío, a excepción de alguna prenda olvidada. \
    Al fijarme en las puertas que acabo de abrir, \
    poso mi vista casualmente tras ellas. Las cierro con cuidado. \
    Noto unas marcas en la pared, como si el armario hubiera sido \
    ${empujado, empuja armario} a lo largo de la misma."
}

objWardrobe.prePush = function() {
    toret = "";
    
    if ( !this.pushed ) {
        this.pushed = true;
        ctrl.places.doDesc();
        toret = "Has empujado el armario. Al principio parecía que \
            no iba a moverse, pero finalmente este cedió, \
            pudiendo moverlo un par de metros.";
    } else {
        toret = "Ya lo empujaste.";
    }
    
    return toret;
}


// -------------------------------------------------------------- Sea
const locSea = ctrl.places.creaLoc(
    "Mar", ["mar"],
    "Levanto la cabeza y allí está, en medio del ${mar, ex agua}. \
    Mido la distancia, sé que estaré en la orilla en cinco minutos, \
    o sea que son unos trescientos metros. \
    Es un ${pequeño islote, ex isla} rocoso en parte, \
    arenoso en su mayoría, \
    destacando recortado contra el turquesa del ${cielo, ex cielo}. \
    Y mientras tanto, yo nado. \
    Inconscientemente incremento el ritmo de mis brazadas. \
    El objetivo es el islote, \
    y ya percibo un aclaramiento en el fondo que precede \
    al dorado del lecho arenoso."
);
locSea.pic = "res/island.jpg";

locSea.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() < 1 ) {
        toret = "Nado. El agua fluye a mi alrededor, \
                 provocando canales de frío liquido acariciando \
                 mi cuerpo. Los musculos agradecen \
                 la frescura del líquido, \
                 deslizándome entre la corriente. \
                 Y mientras tanto, yo nado. \
                 La sensación es muy agradable. \
                 El mar cambia en un rango de azules \
                 entre celeste cristalino en la superficie, \
                 y malva en las profundidades. \
                 Y mientras tanto, yo nado. \
                 Rítmicamente, deslizandome por la superficie, \
                 expulsando el aire de mis pulmones, \
                 tomando de nuevo aire al girar la cabeza \
                 tras el recobro, remando con mis brazos, \
                 deslizándome aún un poco más, y vuelta a empezar."
                 + "<br/>" + toret;
    }
    
    return toret;
}

const objIsland = ctrl.creaObj(
    "isla", ["islote"],
    "Un pequeño islote en la distancia. \
     Se aprecian rocas y una playa arenosa en el medio. \
     Redoblo mis esfuerzos, pero, \
     por alguna razón, no soy capaz de llegar allí.",
    locSea,
    Ent.Scenery
);

const objSea = ctrl.creaObj(
    "agua", [],
    "El agua me rodea y fluye a mi alrededor, \
     mientras me desplazo agradablemente por ella. \
     El cristalino elemento solo permite apreciar \
     un vago reflejo arenoso en ${el fondo, ex fondo}.",
    locSea,
    Ent.Scenery
);

gettingThereMsgs = [
    "la duna se recorta cerca ya, \
     e incluso distingo las ondulaciones en la arena.",
    "veo ahora como pequeñas ondas se estrellan contra \
     la dorada concha de la isla."
];

function gettingThere(fromObj)
{
    let toret = fromObj.desc;
    
    if ( fromObj.getTimesExamined() > 2 ) {
        ctrl.goto( locBeach );
        fromObj.setTimesExamined( 1 );
        toret = "Pero comprobando que estaba ya muy cerca, \
                 Me he esforzado un poco \
                 para poder emerger en la playa de arena dorada \
                 cuanto antes.";
    } else {
        toret += ": "
               + gettingThereMsgs[ fromObj.getTimesExamined() - 1 ];
    }
    
    return toret;
}

const objSeaBed = ctrl.creaObj(
    "fondo", [],
    "Tras una honda inspiración, me sumerjo cambiando \
     a braza para alcanzar el fondo. Aquí y allá rocas \
     con moluscos y algas salpican la arena dorada, que \
     tiene en este punto un tono verde. Necesito aire. \
     Emerjo de nuevo, y recupero el aliento \
     continuando a braza brevemente sobre la superficie",
     locSea,
     Ent.Scenery
);

objSeaBed.preExamine = function() {
    return gettingThere( this );
}

const objSky = ctrl.creaObj(
    "cielo", [],
    "El cielo es de un agradable color turquesa, \
    con matices dorados que sé que provienen del ${sol, ex sol}.",
    locSea,
    Ent.Scenery
);

const objSun = ctrl.creaObj(
    "sol", [],
    "Giro sobre mi mismo para nadar a espalda y poder, de esta forma, \
     observar al astro rey. La luz es cegadora, aún a través de \
     de las gafas de natacion oscuras. De hecho, debo cerrar los ojos \
     a la vez que siento la imperiosa necesidad de abrirlos. \
     De repente, recuerdo que nado a espalda y giro de nuevo, \
     recobrando el estilo libre.<br/>\
     Haciendo planear mi brazo derecho sobre el agua, \
     me incorporo para mirar adelante, y puedo apreciar \
     como el islote está apreciablemente más cerca",
    locSea,
    Ent.Scenery
);

objSun.preExamine = function() {
    return gettingThere( this );
}


// ------------------------------------------------------------ Beach
const locBeach = ctrl.places.creaLoc(
    "Playa", [ "arenal" ],
    "El ${arenal, ex arena} se extiende de izquierda a derecha, \
     coronado por una ${duna, n}. \
     Agradezco momentaneamente el contraste del calor \
     entre la arena y la planta de los pies, \
     mientras noto como el sol lame mi piel."
);
locBeach.pic = "res/sandy_beach.jpg";

const objSand = ctrl.creaObj(
    "arena", [],
    "La arena se extiende a izquierda y derecha, \
     formando una suave pendiente delante de ti, \
     hacia la ${duna, n}. ",
    locBeach,
    Ent.Scenery
);

// ------------------------------------------------------------- Dune
const locDune = ctrl.places.creaLoc(
    "Duna", ["colina"],
    "Con facilidad corono la pequeña duna que conforma \
     la parte central de la isla, caminando desde la ${playa, s} \
     en la que salí del agua. \
     La ${arena, ex arena} produce suaves ondulaciones \
     que crean una curiosa escena. \
     Más ${adelante, n}, otra ${playa, ex playa} \
     da paso de nuevo al ${mar, ex mar}, \
     enmarcada por los rompientes a ambos lados."
);
locDune.pic = "res/dune.jpg";
locDune.setExitBi( "sur", locBeach );

const objSandOfDune = ctrl.creaObj(
    "arena", [ "arenal" ],
    "La arena se desparrama en todas direcciones. ",
    locDune,
    Ent.Scenery
);

objSandOfDune.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() < 2 ) {
        toret = "La brisa moldea los ligeros valles y montañas \
                 del tapizado por debajo de mi. \
                 Una fina granizada de suave arena ruge a ras de suelo. \
                 Siento un ligero cosquilleo al notarla \
                 golpear contra mis pies. "
                + toret;
    }
    
    switch( this.getTimesExamined() ) {
        case 1: toret += "Aquí y allá puedes ver varios \
                          ${objetos semienterrados, ex arena}.";
                break;
        case 2: toret += "Me llama la atención una ${foto, ex foto} \
                 que asoma entre los granos de arena.";
                locDune.desc += "<br/>Una ${foto, ex foto} yace \
                                 semienterrada en la arena.";
                ctrl.places.doDesc();
                break;
        case 3: toret += "Hay varios objetos alrededor de una \
                          ${depresión, ex depresion} en la arena.";
                break;
        case 4: toret += "Hay un ${zapato, ex zapato} \
                          semioculto en el suelo.";
                locDune.desc += " Cerca hay un ${zapato, ex zapato}.";
                ctrl.places.doDesc();
                break;
        case 5: toret += "Veo el cuello de una ${botella, ex botella} \
                          como la proa de un barco hundido en la arena.";
                locDune.desc += " Una ${botella, ex botella} \
                                 parece emerger del centro de una \
                                 ${depresión, ex depresion}.";
                ctrl.places.doDesc();
                break;
        case 6: toret += "También en la ${depresión, ex depresion}, \
                          puedo ver un ${recipiente azul, ex recipiente}, \ semienterrado.";
                locDune.desc += " Un ${recipiente, ex recipiente} \
                                 asoma también por allí.";                                 
                ctrl.places.doDesc();
                break;                
        default:
                toret += "No hay nada más que capte mi atención.";
            
    }
    
    return toret;
};

const objZapato = ctrl.creaObj(
    "zapato", [ "calzado", "zapatilla", "alpargata" ],
    "Una alpargata cuya mejor vida ya ha quedado atrás.",
    locDune,
    Ent.Scenery
);

objZapato.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() < 2 ) {
        toret = "Sacas el zapato de la arena de un tirón, \
                 para a continuación dejarlo caer sobre la arena, \
                 no sin cierto asco. " + toret;
    }
    
    return toret;
};

const objDepression = ctrl.creaObj(
    "depresión", [ "depresion", "concavidad" ],
    "Pues sí, mientras la ${arena, ex arena} del resto de la duna \
     moldea una ligera forma convexa, \
     en esta zona la apariencia es definitivamente cóncava.",
    locDune,
    Ent.Scenery
);

const objPhoto = ctrl.creaObj(
    "foto", [ "fotografía" ],
    "Separando sin dificultad los granos de arena en derredor, \
     compruebo que se trata de... ¡una foto mía! \
     Estoy corriendo en alguna competición. \
     Es curioso, noto como un dolor de piernas. ",
    locDune,
    Ent.Scenery
);

objPhoto.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() > 1 ) {
        toret = "Vuelvo sobre mis pasos para volver a mirar \
                 la foto. Aunque no reconozco poco más en ella \
                 aparte de mi mismo, contemplarla me trae un vívido \
                 dolor a las piernas.";
    }
    
    return toret;
};

const objRecipient = ctrl.creaObj(
    "recipiente", [],
    "Cavas a su alrededor, para descubrir que es \
     un bote de lejía o suavizante.",
    locDune,
    Ent.Scenery
);

objRecipient.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() > 1 ) {
        toret = "Un recipiente para productos de limpieza.";
    }
    
    return toret;
};

const objBottle = ctrl.creaObj(
    "botella", [ "cuello", "barco", "proa" ],
    "Se trata de una botella de cristal blanco, grueso y \
     transparente. Siento el fuerte impulso de \
     ${tirar, tira de botella} de él para desenterrarlo.",
    locDune,
    Ent.Scenery
);

objBottle.timesPulled = 0;
objBottle.pullingMsgs = new MsgList([
    "Es inútil, pero noto como si la arena \
     se desprendiese de sus laterales.",
    "Has notado como si algo se liberara de repente."
]);

objBottle.prePull = function() {
    let toret = this.pullingMsgs.nextMsg();
    
    ++this.timesPulled;
    if ( this.timesPulled > 2 ) {
        toret = "¡Se abrió el vacío \
                 al lograr desenterrar la botella!";
        ctrl.goto( locTunnel1 );
    }
    
    return toret;
};

const objNextIsland = ctrl.creaObj(
    "isla", [ "tierra" ],
    "La siguiente isla se adivina en lontananza. Aunque sé que me \
     tendré que esforzar algo para llegar hasta ella, \
     no es una distancia más larga de dos kilómetros. ",
    locDune,
    Ent.Scenery
);

const objSeaFromDune = ctrl.creaObj(
    "mar", [ "agua" ],
    "El agua me rodea en todas direcciones. ",
    locDune,
    Ent.Scenery
);

const objBeach2 = ctrl.creaObj(
    "playa", [],
    "Desde la cima de la colina puedo ver la playa del otro lado, \
     que me permite volver al ${mar, ex mar} a nadar \
     hasta la siguiente ${isla, ex isla}. \
     La ${duna, mirar} a mi alrededor parece ser la cima del mundo. ",
    locDune,
    Ent.Scenery
);

objBeach2.preExamine = function() {
    const toret = this.desc;
    
    ctrl.places.showPic( "res/beach2.jpg", "center" );
    
    return toret;
};


// ------------------------------------------------------ North beach
const locNorthBeach = ctrl.places.creaLoc(
    "Playa", [ "arenal" ],
    "La playa norte del islote es muy parecida al arenal \
     que acabo de dejar atrás. Mis pies agradecen el calor más suave \
     de la arena aquí, tras descender desde la duna. \
     Ahora puedo seguir ${nadando, n} hacia la siguiente isla." );
locNorthBeach.pic = "res/beach2.jpg";
locNorthBeach.setExitBi( "sur", locDune );
locNorthBeach.setExit( "norte", locSea );


// ---------------------------------------------------------- Tunnel1
const locTunnel1 = ctrl.places.creaLoc(
    "Túnel", [ "tunel", "cueva" ],
    "El túnel se extiende hacia ${adelante, n}, húmedo y oscuro. \
     El ${suelo irregular, ex suelo} hace difícil el avance \
     con mis pies desnudos."
);
locTunnel1.pic = "res/tunnel1.jpg";

const objTunnel1Floor = ctrl.creaObj(
    "suelo", [ "abajo" ],
    "Las ${piedras, ex piedras} que conforman el suelo \
     son pulidos cantos rodados que resbalan por la humedad.",
    locTunnel1,
    Ent.Scenery
);

const objTunnel1Stones = ctrl.creaObj(
    "piedras", [ "piedra", "cantos", "canto" ],
    "Los pulidos cantos alfombran el suelo.",
    locTunnel1,
    Ent.Scenery
);

objTunnel1Stones.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() == 1 ) {
        toret += " Me he tropezado al mirar hacia abajo, \
                  dejando al descubierto un pequeño \
                  ${palo, ex palo}.";
        objStick.moveTo( this.owner );
        ctrl.places.doDesc();
    }
    
    return toret;
};

const objStick = ctrl.creaObj(
    "palo", [],
    "Una pequeño trozo de madera.",
    ctrl.places.limbo,
    Ent.Portable
);

locTunnel1.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() < 1 ) {
        toret = "Una gran grieta se ocultaba bajo \
                 aquella depresión, que ha resultado ser \
                 un tapón de arena cediendo bajo mis pies. \
                 Aquel agujero daba paso a una cueva, \
                 que se estrechaba rapidamente.<br/>"
                + toret;
    }
    
    return toret;
}


// ---------------------------------------------------------- Tunnel2
const locTunnel2 = ctrl.places.creaLoc(
    "Túnel", ["tunel", "cueva" ],
    "El túnel, por algún motivo, \
     se va haciendo más estrecho, angosto... oscuro. \
     <br/>\
     Las ${paredes, ex paredes} son lisas, \
     parecen de arena cristalizada. \
     Con ${cada paso, n}, noto como la humedad se pega a mi piel. \
     Primero me encorvo, después me agacho, mientras me araño \
     al avanzar con algunas de las piedras que forman sus paredes. \
     <br/>\
     Me tranquiliza saber que podría dar media vuelta, \
     ${retroceder, s} en cualquier momento."
);
locTunnel2.pic = "res/tunnel2.jpg";
locTunnel2.setExitBi( "sur", locTunnel1 );

const objTunnel2Walls = ctrl.creaObj(
    "paredes", [ "pared" ],
    "La arena que conforma la bóveda está como cristalizada, \
     es muy suave y produce una sensación muy curiosa pasar \
     la palma de la mano por ella. En un lateral, hay una zona \
     que desprende una ${extraña luz, ex luz}.",
    locTunnel2,
    Ent.Scenery
);

const objTunnel2Light = ctrl.creaObj(
    "luz", [ "resplandor" ],
    "En la parte inferior, se abre un pequeño hueco en el que puedes \
     apreciar un... ${tubo fluorescente, ex tubo}.",
    locTunnel2,
    Ent.Scenery
);

objTunnel2Light.preExamine = function() {
    if ( ctrl.places.limbo.has( objFluorescent ) ) {
        objFluorescent.moveTo( this.owner );
    }
    
    ctrl.places.doDesc();
    return this.desc;
}
    
const objFluorescent = ctrl.creaObj(
    "fluorescente", [ "tubo" ],
    "Un tubo de cristal blanco con los extremos metálicos. \
     Pese a que la luz que emana de él \
     es muy tenue, la arena cristalizada de las paredes \
     la reflejan por todo el túnel.",
    ctrl.places.limbo,
    Ent.Portable
);

objFluorescent.preTake = function() {
    let toret = "Lo saco de su soporte, y me encuentro con una situación \
                realmente extraña: todo sigue iluminado, incluso el tubo. \
                Tras fijarme bien, decido que es la luz que todavía emana del tubo \
                la que permite ver en toda la cueva.";
    
    if ( locTunnel2.has( this ) ) {
        this.moveTo( ctrl.personas.getPlayer() );
    } else {
        toret = takeAction.exe( parser.sentence );
    }
    
    return toret;
}


// ----------------------------------------------------- Tunnel's end
const locTunnelEnd = ctrl.places.creaLoc(
    "Fin del túnel", ["tunel", "cueva", "fondo" ],
    "Este es el final, y mucho más oscuro. \
     Incluso contando desde que \
     ${comencé a agacharme, s} me encuentro \
     en la parte más estrecha con diferencia. \
     Ahora debo caminar a cuatro patas e incluso \
     arrastrarme."
);
locTunnelEnd.pic = "res/tunnel_end.jpg";
locTunnelEnd.setExitBi( "sur", locTunnel2 );

locTunnelEnd.preExamine = function() {
    let toret = this.desc;
    
    if ( ctrl.isPresent( objFluorescent ) ) {
        toret += " Con la luz veo un poco más. \
                  Si me estiro, puedo alcanzar \
                  un ${hueco, ex hueco} al fondo."
    }

    return toret;
}

const objTunnelHole = ctrl.creaObj(
    "agujero", [ "hueco" ],
    "Un agujero me permitiría salir de este túnel, \
     si fuese un poco más grande. \
     El tamaño actual no permite que mi cuerpo pase por él. \
     En su interior, puedo ver ${una piedra, ex piedra}.",
    locTunnelEnd,
    Ent.Scenery
);

const objStoneInHole = ctrl.creaObj(
    "piedra", [ "roca" ],
    "La piedra se aferra a uno de los laterales \
     del ${agujero, ex agujero}. Bloquea buena parte del mismo, \
     mientras que las restantes paredes son de blanda tierra. \
     Si pudiese ${desencajarla, coge piedra}, \
     podría ensanchar el pasaje y crear una salida.",
    locTunnelEnd,
    Ent.Scenery
);

objStoneInHole.preTake = function() {
    let toret = "No puedo hacerlo, se agarra con demasiada fuerza.";
    
    if ( ctrl.isPresent( objStick ) ) {
        toret = "Haciendo palanca con el palo, desencajé la piedra. \
                 Finalmente, he salido del túnel. \
                 Con dificultad, arrastrándome, \
                 rasgando mi piel. Dolorido allí \
                 donde me he golpeado, \
                 con escozor allí donde \
                 me he arañado, \
                 por fin hinché el pecho de aire, \
                 pudiendo respirar libremente. \
                 Tumbado en el suelo, \
                 respiro humedad y barro, \
                 mis manos resbalan en \
                 pequeñas piedras \
                 mientras me incorporo.";
        ctrl.goto( locChimney );
    }
    
    return toret;
};


// ----------------------------------------------------- Chimney
const locChimney = ctrl.places.creaLoc(
    "Chimenea", [ "tunel", "pozo", "cueva", "chimenea" ],
    "Un pozo vertical, estrecho, de \
     ${húmedas paredes, ex paredes} de tierra y roca. \
     Tengo espacio suficiente para abrir los brazos \
     completamente. Estoy aliviado en parte, \
     pues me siento libre y encerrado al mismo tiempo. \
     En la ${abertura, ex abertura} veo algo de luz más brillante, \
     y tengo parte del cuerpo sumergido en ${agua, ex agua}."
);
locChimney.pic = "res/chimney.jpg";
locChimney.ascentLevel = 0;
locChimney.maxAscentLevel = 16;
locChimney.ascend = function(msg) {
    this.ascentLevel += 1;
    
    if ( this.ascentLevel == 1 ) {
        ctrl.places.doDesc();
    }
    else
    if ( this.ascentLevel >= this.maxAscentLevel ) {
        var dvCmds = ctrl.getHtmlPart( "dvCmds" );
        dvCmds.style.display = "none";
    
        this.desc = "";
        ctrl.places.doDesc();
        
        msg = "<p>Noto como el agua sube por mi cuerpo, \
                 llegando a sumergir mi cabeza. \
                 La estiro hacia arriba para poder respirar \
                 mientras el hueco me lo permite, pero... \
                 eventualmente el agua sobrepasa mi cabeza \
                 para rellenar la estrecha abertura. \
                 Ya no tengo más remedio que contener la respiración. \
                 Sostengo la tensión, viendo la luz colarse por \
                 el líquido elemento, reflejado en las burbujas \
                 de aire que permito escapan por mi boca. \
                 Pero no aguanto más... necesito respirar. \
                 Respirar. ${RESPIRAR, ex respiracion}...</p>";
    } else {
        msg += "<p>El nivel del ${agua, ex agua} sigue subiendo.</p>";
    }
    
    
    return msg;
};

const objBreahting = ctrl.creaObj(
    "respiracion", [ "aliento" ],
    "",
    locChimney,
    Ent.Scenery
);

objBreahting.preExamine = function() {
    ctrl.goto( locDorm );
}


locChimney.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined <= 1 ) {
        toret = "El túnel de repente se ha abierto hacia... un pozo. "
                + toret
                + " Noto corrientes alrededor de mi cuerpo, \
                   allí donde el agua fluye, \
                   y oigo el rumor acuoso que las acompaña.";   
    }
    
    return toret;
};

const objExitChimney = ctrl.creaObj(
    "abertura", [ "apertura", "salida" ],
    "Por encima de tu cabeza, arroja una banda de luz reconfortante.",
     locChimney,
     Ent.Scenery
);

objExitChimney.msgList = [
    objExitChimney.desc,
    "La ${abertura, ex salida} se sitúa aún muy arriba.",
    "La ${arriba, ex salida} arroja una luz aún tenue.",
    "Como si fuera una chimenea, solo se puede salir por ${arriba, ex salida}.",
    "El ${techo, ex salida} del pozo se ve a varios metros, \
        así como pequeñas aberturas en derredor \
        por las que se cuelan alfilerazgos de luz.",
    "Aún distante, la ${apertura, ex salida} se acerca poco a poco.",
    "A medida que la ${salida, ex salida} se aproxima, \
        la ${chimenea, ex paredes} se va estrechando.",
    "La salida se sitúa por encima de mi, más cercana.",
    "El ${techo, ex salida} del pozo se ve a unos metros.",
    "La salida se sitúa bastante por encima.",
    "Me preocupa ver cómo las ${paredes, ex paredes}, \
        se estrechan a medida que asciendo impulsado por el \
        ${agua, ex agua}, mientras la ${salida, ex salida} \
        se acerca cada vez más.",
    "Examinando la ${salida, ex salida}  sobre mi cabeza \
        con más detalle, sé que... ¡no cabré!  \
        La abertura es demasiado pequeña.",
    "La estrechez de la ${salida, ex salida} empieza a preocuparme \
        por la cantidad de ${agua, ex agua} a mi alrededor, así \
        como la estrechez de las ${paredes, ex paredes}, \
        que aumenta por momentos. Saco la cabeza por la abertura, \
        aunque mis hombros tropiezan irremediablemente.",
    "Definitivamente, la ${salida, ex salida} es demasiado pequeña, \
        no permitiendo pasar mis hombros, aunque sí sacar la cabeza.",
    "El ${agua, ex agua} sube inexorable, cubriendo mis hombros y \
        empezando a subir por la ${abertura, ex salida}, cubriendo \
        mi cabeza en un momento."
];

objExitChimney.preExamine = function() {
    const toret = this.msgList[ locChimney.ascentLevel ];
    
    return locChimney.ascend( toret );
};

const objWaterChimney = ctrl.creaObj(
    "agua", [ "corrientes" ],
    "El ${agua, ex agua} me envuelve, \
     subiendo por la ${roca, ex paredes} centímetro a centímetro \
     por momentos.",
     locChimney,
     Ent.Scenery
);

objWaterChimney.msgList = [
    objWaterChimney.desc,
    "El nivel de ${agua, ex agua} ha subido dramáticamente. \
        Floto ya en ella, moviendo los brazos para \
        mantenerme por encima. Hacia ${arriba, ex salida}, \
        veo una salida.",
    "La entrada del estrecho túnel \
        ya no se ve al mirar hacia abajo, donde se juntan \
        las ${paredes, ex paredes}; al mirar hacia \
        ${arriba, ex salida} veo luz.",
    "El ${agua, ex agua} me empuja hacia arriba. \
        Las ${paredes, ex paredes} se estrechan cada vez más. \
        El pequeño túnel por el que entré \
        se ha perdido ya definitivamente, mientas por encima \
        veo una ${abertura, ex salida}.",
    "Subiendo sin parar, el ${agua, ex agua} me rodea, \
        haciéndome girar y llevándome contra las \
        ${paredes, ex paredes} de la chimenea.",
    "Chapoteo, tratando de mantenerme en la superficie y de no \
        golpearme con las ${paredes, ex paredes}.",
    "Subiendo sin parar, trato de mantenerme como puedo con la cabeza \
        fuera del agua, mientras mantengo la distancia con \
        las ${paredes, ex paredes} mediante los brazos.",
    "Cada vez más arriba, puedo ver ya mucho más cercana \
        la ${salida, ex salida}, que arroja un cono de luz sobre \
        mi cabeza.",
    "Subiendo, subiendo, me araño contra las rocas que forman \
        las ${paredes, ex paredes} de esta chimenea.",
    "La ${abertura, ex salida} sobre mi se aproxima cada vez más, \
        mientras las ${paredes, ex paredes} se van estrechando.",
    "Me golpeo contra las ${rocas, ex paredes} mientras trato de \
        mantenerme a flote.",
    "Ahora extiendo los brazos, agarrándome al techo donde se sitúa \
        la única ${salida, ex salida} de este lugar.",
    "La ${abertura, ex salida} es demasiado pequeña para poder salir \
        por ella. Puedo sacar la cabeza por ella, pero los hombros \
        se mantienen debajo, atrapados por las ${rocas, ex paredes}.",
    "La desesperación me invade mientras el agua va cubriendo \
        mi cuello, manteniéndome apenas por encima del nivel \
        agarrándome a las ${rocas, ex paredes}.",
    "Puedo notar cómo el agua sigue subiendo, cubriendo mi cara \
        hasta no poder más que observar la luz distorsionada por las \
        movimientos del líquido."
];

objWaterChimney.preExamine = function() {
    const toret = this.msgList[ locChimney.ascentLevel ];
    
    return locChimney.ascend( toret );
};

const objWallsChimney = ctrl.creaObj(
    "pared", [ "paredes", "roca", "rocas" ],
    "Las ${paredes de roca, ex paredes} me rodean. \
     Aunque pueda estirar los brazos, \
     estoy atrapado en este sitio.",
     locChimney,
     Ent.Scenery
);

objWallsChimney.msgList = [
    objWallsChimney.desc,
    "La roca que me encierra forma unas ${paredes, ex paredes} \
     imperfectas, pero suficientes para mantenerme atrapado, \
     casi sumergido de ${agua, ex agua}.",
    "Me mantengo a flote sobre el ${agua, ex agua} entre las rocas.", 
    "No puedo encontrar ningún indicio por debajo \
        del ${agua, ex agua} acerca del túnel que \
        me trajo hasta aquí. Aunque no he sido consciente, \
        la cantidad del agua que ha fluído ya aquí dentro \
        es considerable.",
    
    "Las rocas a mi alrededor contienen el ${agua, ex agua} \
        que me impulsa hacia arriba cada vez con más violencia.",
    "Aunque me mantengo sin dificultad a flote, noto como \
     cada vez el ${hueco, ex paredes} se va haciendo más estrecho.",
    "Me rasco contra las rocas a medida que asciendo, pataleando y \
        braceando sobre el agua. La ${abertura, ex salida} sobre mi \
        se va acercando cada vez más.",
    "Continúo ascendiendo sobre la corriente de ${agua, ex agua}.",
    
    "La ${abertura, ex abertura}, aún lejana, deja sentir claramente \
        el paso de la luz dentro de la chimenea.",
    "No hay otra salida que la ${abertura, ex salida} sobre mi \
        cabeza. Mientras intento no golpearme con la roca, fabrico \
        la esperanza de que al subir con el ${agua, ex agua}, \
        pueda alcanzarla.",
    "Subo y subo sobre el ${agua, ex agua}, buscando continuamente la \
        ${abertura, ex salida} que sé que se encuentra sobre mi.",
     
    "El techo y las paredes se estrechan sobre mi. Me mantengo a \
        distancia con los brazos mientras compruebo \
        desesperado que la abertura no permite pasar mi cuerpo.",
    "¡La ${abertura, ex salida} es demasiado estrecha! Mis hombros \
        se quedan atrás mientras saco la cabeza por el hueco, \
        desesperadamente en busca de aire.",
    "Ahora apenas puedo separar los brazos del cuerpo. \
        El ${agua, ex agua} empieza ahora a subir por mi cuello, \
        alcanzando mi cara.",
    "Contengo la respiración mientras el agua sobrepasa mi cara y \
        la luz se distorsiona con las burbujas que escapan de mi."
];

objWallsChimney.preExamine = function() {
    const toret = this.msgList[ locChimney.ascentLevel ];
    
    return locChimney.ascend( toret );
};

// ------------------------------------------------------------- Dorm
const locDorm = ctrl.places.creaLoc(
    "Chimenea", [ "tunel", "pozo", "cueva", "chimenea" ],
    "...y finalmente, despierto. \
    Confuso, me incorporo y miro a mi alrededor. \
    A mi lado, en la mesilla de noche, está la \
    <a href='https://es.wikipedia.org/wiki/CPAP' target='_blank'>CPAP</a>, \
    emitiendo su molesto ronroneo ventoso. \
    Me la he vuelto a quitar de noche, sin darme cuenta. \
    Un suave pero molesto dolor de cabeza presiona mi cuello cabelludo \
    contra el cráneo, y puedo notar claramente los ojos hinchados. \
    Suspiro. Otra noche más, durmiendo, pero sin ${descansar, ex cama}."
);
locDorm.pic = "res/cpap.jpg";

function amusing() {
    return "Las <a target='_blank' href='https://es.wikipedia.org/wiki/Síndrome_de_apnea-hipopnea_durante_el_sueño'>apneas del sueño</a> \
            son un mal conocido por bloquearse involuntariamente \
            las vías respiratorias sin poder respirar adecuadamente, \
            produciéndose una pobre oxigenación de la sangre. \
            Aunque la mayor parte de las veces se prescribe una dieta \
            para adelagazar, existen casos de pacientes que la padecen \
            sin presentar sobrepeso u obesidad. \
            No existe curación para la apnea del sueño, \
            más allá de un tratamiento paliativo que consiste en \
            el uso de la CPAP, un aparato que no todos los pacientes \
            toleran. \
            <br/>Esta historia interactiva está de hecho basada \
            en mi propia experiencia, que se manifiesta en sueños \
            repetitivos, frustrantes, o en los que directamente, \
            no puedo respirar debido a paredes que se estrechan, agua \
            que sube...";
}

var htmlRestartEnding = "<p align='right'>\
                         <a href='javascript: location.reload();'>\
                         <i>Comenzar de nuevo</i></a>.<br/>\
                         <i><a href='#' onClick=\"javascript: \
                         document.getElementById('pAmenity').\
                         style.display='block'; return false\">\
                         Ver curiosidades</a>.</i></p>\
                         <p id='pAmenity' align='right' style='display: none'>" + amusing() + "</p>";

const objBed = ctrl.creaObj(
    "cama", [ "lecho" ],
    "",
    locDorm,
    Ent.Scenery
);

objBed.preExamine = function() {
    var dvCmds = ctrl.getHtmlPart( "dvCmds" );
    dvCmds.style.display = "none";
    
    ctrl.endGame( "Pero la vida sigue. Y debo seguir con ella.<br/>"
                    + htmlRestartEnding,
                  "res/cpap.jpg" );
    return "";
};

// *** PNJs ---------------------------------------------------------
// Player -----------------------------------------------------------
const pnjPan = ctrl.personas.creaPersona( "Pan", [ "pan" ],
    "Algo extraño sucede, de eso estás seguro, aún cuando \
     no aprecias nada realmente fuera de lo común en tu cuerpo \
     ni en derredor.",
    locRoom
);
 
 
// Boot ----------------------------------------------------------------
ctrl.personas.changePlayer( pnjPan );
ctrl.lugares.setStart( locRoom );
