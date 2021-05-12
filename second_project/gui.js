const obj = {
    red: 0.5,
    blue: 0.5,
    green: 0.5,
    Diffusion_Rate: 25,
    Viscosity: 25,
};

gui.green = 0.5;
gui.red = 0.5;
gui.blue = 0.5;
gui.Diffusion_Rate = 25;
gui.viscosity = 25;

function gui_setup() {
    gui.add(obj, 'red').min(0.1).max(1.0).step(0.1)
        .onChange((newValue) => {
            gui.red = newValue;
            setRed(newValue);
        });

    gui.add(obj, 'blue').min(0.1).max(1.0).step(0.1)
        .onChange((newValue) => {
            gui.blue = newValue;
            setBlue(newValue);
        });
    gui.add(obj, 'green').min(0.1).max(1.0).step(0.1)
        .onChange((newValue) => {
            gui.green = newValue;
            setGreen(newValue);

        });
    gui.add(obj, 'Diffusion_Rate').min(0).max(50).step(1)
        .onChange((newValue) => {
            gui.diffusion = newValue / 1000000.0;
            updateDiffuse(gui.diffusion);
        });
    gui.add(obj, 'Viscosity').min(0).max(50).step(1)
        .onChange((newValue) => {
            gui.viscosity = newValue / 1000000.0;
            updateViscosity(gui.viscosity);
        });
}

gui_setup();
