const _SIDES = [
    { name: 'front', color: 'lime', rotX: 0, rotY: 0, rotZ: 0, tranX: 0, tranY: 0, tranZ: 0 },
    { name: 'back', color: 'blue', rotX: 0, rotY: 180, rotZ: 0, tranX: 0, tranY: 0, tranZ: -100 },
    { name: 'left', color: 'orange', rotX: 0, rotY: -90, rotZ: 0, tranX: -50, tranY: 0, tranZ: -50 },
    { name: 'right', color: 'red', rotX: 0, rotY: 90, rotZ: 0, tranX: 50, tranY: 0, tranZ: -50 },
    { name: 'top', color: 'white', rotX: 90, rotY: 0, rotZ: 0, tranX: 0, tranY: -50, tranZ: -50 },
    { name: 'bottom', color: 'yellow', rotX: -90, rotY: 0, rotZ: 0, tranX: 0, tranY: 50, tranZ: -50 }
];

const _COVERS = [
    { name: 'front', rotX: 0, rotY: 0, rotZ: 0, tranX: 0, tranY: 0, tranZ: 100 },
    { name: 'back', rotX: 0, rotY: 180, rotZ: 0, tranX: 0, tranY: 0, tranZ: -100 },
    { name: 'left', rotX: 0, rotY: -90, rotZ: 0, tranX: -100, tranY: 0, tranZ: 0 },
    { name: 'right', rotX: 0, rotY: 90, rotZ: 0, tranX: 100, tranY: 0, tranZ: 0 },
    { name: 'top', rotX: 90, rotY: 0, rotZ: 0, tranX: 0, tranY: -100, tranZ: 0 },
    { name: 'bottom', rotX: -90, rotY: 0, rotZ: 0, tranX: 0, tranY: 100, tranZ: 0 }
];

const _CUBES = [
    { translates: [0, 0, 0], rotates: [0, 0, 0,], colors: ['-','blue','orange','-','white','-'], origins: [100, 100, 0] },
    { translates: [100, 0, 0], rotates: [0, 0, 0,], colors: ['-','blue','-','red','white','-'], origins: [0, 100, 0] },
    { translates: [0, 0, 100], rotates: [0, 0, 0,], colors: ['lime','-','orange','-','white','-'], origins: [100, 100, -100] },
    { translates: [100, 0, 100], rotates: [0, 0, 0,], colors: ['lime','-','-','red','white','-'], origins: [0, 100, -100] },
    
    { translates: [0, 100, 0], rotates: [0, 0, 0,], colors: ['-','blue','orange','-','-','yellow'], origins: [100, 0, 0] },
    { translates: [100, 100, 0], rotates: [0, 0, 0,], colors: ['-','blue','-','red','-','yellow'], origins: [0, 0, 0] },
    { translates: [0, 100, 100], rotates: [0, 0, 0,], colors: ['lime','-','orange','-','-','yellow'], origins: [100, 0, -100] },
    { translates: [100, 100, 100], rotates: [0, 0, 0,], colors: ['lime','-','-','red','-','yellow'], origins: [0, 0, -100] },

    // { tranX: 100, tranY: 0, tranZ: -50, rotX: 0, rotY: 0, rotZ: 0 },
    // { tranX: 0, tranY: 0, tranZ: 50, rotX: 0, rotY: 0, rotZ: 0 },
    // { tranX: 100, tranY: 100, tranZ: 50, rotX: 0, rotY: 0, rotZ: 0 },
];

const AXIS_X = 0, AXIS_Y = 1, AXIS_Z = 2, _CUBESIZE = 2, _MATRIX = [
    [
        [ 0, 1 ],
        [ 2, 3 ]
    ],
    [
        [ 4, 5 ],
        [ 6, 7 ]
    ]
];

var ISIDE_VOID = false, ISIDE_CUBE = false, MOUSE_DOWN = false;
var mX0, mY0, cubeRotX = 0, cubeRotY = 0;
var dX, dY, delay, e0, rotX, rotY, rotZ, i0, j0, k0, side_i, side_j, dR, dir;

const VUE1 = new Vue({
    el: '#VUE1',
    data: {
        sides: _SIDES,
        cubes: _CUBES,
        rotatingCubes: [1,2,3],
        covers: _COVERS,
        cubeRotX: 0,
        cubeRotY: 0,
        cubeRotZ: 0,
        matrix: _MATRIX,
    },
    methods: {
        voidMouseDown(e)
        {
            if (e.target == document.getElementById('VUE1'))
            {
                ISIDE_VOID = true;
                ISIDE_CUBE = false;
            }
            else if (e.target.className.indexOf('cover') != -1)
            {
                ISIDE_VOID = false;
                ISIDE_CUBE = true;
                side_i = Math.trunc(e.offsetY / 100);
                side_j = Math.trunc(e.offsetX / 100);

                dX = 0;
                dY = 0;
                delay = 0;
                e0 = e;
            }
            
            MOUSE_DOWN = true;
            mX0 = e.pageX;
            mY0 = e.pageY;

        },
        voidMouseUp(e)
        {
            MOUSE_DOWN = false;
            // console.log('TOTAL CUBE ROTATE:',rotX, rotY, rotZ);
        },
        voidMouseMove(e)
        {
            //-+-+-+-+-+-+-+-+-+-+-VOID-+-+-+-+-+-+-+-+-+-+-
            if (ISIDE_VOID && MOUSE_DOWN)
            {
                cubeRotY += Math.round((e.pageX - mX0)/3.333);
                cubeRotX += -Math.round((e.pageY - mY0)/3.333);
                if (cubeRotX > 45) cubeRotX = 45;
                if (cubeRotX < -45) cubeRotX = -45;
                if (cubeRotY > 360) cubeRotY -= 360;
                if (cubeRotY < -360) cubeRotY += 360;

                mX0 = e.pageX;
                mY0 = e.pageY;
                
                this.cubeRotX = cubeRotX;
                this.cubeRotY = cubeRotY;
            }

            //-+-+-+-+-+-+-+-+-+-+-CUBE-+-+-+-+-+-+-+-+-+-+-
            if (ISIDE_CUBE && MOUSE_DOWN)
            {
                dX += (e.pageX - mX0);
                dY += (e.pageY - mY0);
                delay++;
                if (delay > 10)
                {
                    console.log(dX,dY);
                    
                    let Axis, constDimension
                    switch (e0.target.innerText) 
                    {
                        //----------TARGET-FRONT----------
                        case 'front':
                            console.log('---TARGET-FRONT---');
                            if (Math.abs(dX) > Math.abs(dY))
                            {
                                dR = 'x';
                                dir = (dX > 0) ? 1 : -1; 
                                constDimension = 'k';
                                Axis = AXIS_Y;
                            }
                            else
                            {
                                dR = 'y';
                                dir = (dY > 0) ? -1 : 1; 
                                constDimension = 'j';
                                Axis = AXIS_X;
                            }

                            this.matrix = this.RotateMatrix3D(this.matrix, _CUBESIZE, constDimension, 1, side_j, side_i, -dir);
                            this.RotateCube3D(Axis, dir);

                        break;
                    
                        default:
                            console.log('OTHER');
                        break;
                    }
                 
                    MOUSE_DOWN = false;
                    delay = 0;
                    dX = 0;
                    dY = 0;
                }
                
                
            }
        },
        RotateCube3D(Axis, direction)
        {
            for (let index of this.rotatingCubes)
            {
                let deg = this.cubes[index].rotates[Axis];
                deg += direction * 90;
                this.$set(this.cubes[index].rotates, Axis, deg);
            }
        },
        RotateMatrix3D(matrix3d, size, constDimension, I0, J0, K0, direction)
        {
            let temp;
            this.rotatingCubes.splice(0);
            //-+-+-+-+-+-+-+-+-+-+-I-+-+-+-+-+-+-+-+-+-+-
            if (constDimension == 'i')
            {
                // COLLECT CUBES
                for (let k = 0; k < size; k++)
                    for (let j = 0; j < size; j++)
                        this.rotatingCubes.push(matrix3d[k][I0][j]);

                // TRANSPONATE
                for (let k = 0; k < size-1; k++)
                    for (let j = k+1; j < size; j++)
                    {
                        temp = matrix3d[k][I0][j];
                        matrix3d[k][I0][j] = matrix3d[j][I0][k];
                        matrix3d[j][I0][k] = temp;
                    }
                // MIRRORATE
                if (direction == 1)
                {
                    for (let k = 0; k < size; k++)
                        for (let j = 0; j < Math.trunc(size/2); j++)
                        {
                            temp = matrix3d[k][I0][j];
                            matrix3d[k][I0][j] = matrix3d[k][I0][size-j-1];
                            matrix3d[k][I0][size-j-1] = temp;
                        }
                }
                else
                {
                    for (let j = 0; j < size; j++)
                        for (let k = 0; k < Math.trunc(size/2); k++)
                        {
                            temp = matrix3d[k][I0][j];
                            matrix3d[k][I0][j] = matrix3d[size-k-1][I0][j];
                            matrix3d[size-k-1][I0][j] = temp;
                        }
                }
            }

            //-+-+-+-+-+-+-+-+-+-+-J-+-+-+-+-+-+-+-+-+-+-
            else if (constDimension == 'j')
            {
                // COLLECT CUBES
                for (let k = 0; k < size; k++)
                    for (let i = 0; i < size; i++)
                        this.rotatingCubes.push(matrix3d[k][i][J0]);

                // TRANSPONATE
                for (let k = 0; k < size-1; k++)
                    for (let i = k+1; i < size; i++)
                    {
                        temp = matrix3d[k][i][J0];
                        matrix3d[k][i][J0] = matrix3d[i][k][J0];
                        matrix3d[i][k][J0] = temp;
                    }
                // MIRRORATE
                if (direction == 1)
                {
                    for (let k = 0; k < size; k++)
                        for (let i = 0; i < Math.trunc(size/2); i++)
                        {
                            temp = matrix3d[k][i][J0];
                            matrix3d[k][i][J0] = matrix3d[k][size-i-1][J0];
                            matrix3d[k][size-i-1][J0] = temp;
                        }
                }
                else
                {
                    for (let i = 0; i < size; i++)
                        for (let k = 0; k < Math.trunc(size/2); k++)
                        {
                            temp = matrix3d[k][i][J0];
                            matrix3d[k][i][J0] = matrix3d[size-k-1][i][J0];
                            matrix3d[size-k-1][i][J0] = temp;
                        }
                }
            }

            //-+-+-+-+-+-+-+-+-+-+-K-+-+-+-+-+-+-+-+-+-+-
            else if (constDimension == 'k') 
            {
                // COLLECT CUBES
                for (let i = 0; i < size; i++)
                    for (let j = 0; j < size; j++)
                        this.rotatingCubes.push( matrix3d[K0][i][j]);

                // TRANSPONATE
                for (let i = 0; i < size-1; i++)
                    for (let j = i+1; j < size; j++)
                    {
                        temp = matrix3d[K0][i][j];
                        matrix3d[K0][i][j] = matrix3d[K0][j][i];
                        matrix3d[K0][j][i] = temp;
                    }
                // MIRRORATE
                if (direction == 1)
                {
                    for (let i = 0; i < size; i++)
                        for (let j = 0; j < Math.trunc(size/2); j++)
                        {
                            temp = matrix3d[K0][i][j];
                            matrix3d[K0][i][j] = matrix3d[K0][i][size-j-1];
                            matrix3d[K0][i][size-j-1] = temp;
                        }
                }
                else
                {
                    for (let j = 0; j < size; j++)
                        for (let i = 0; i < Math.trunc(size/2); i++)
                        {
                            temp = matrix3d[K0][i][j];
                            matrix3d[K0][i][j] = matrix3d[K0][size-i-1][j];
                            matrix3d[K0][size-i-1][j] = temp;
                        }
                }
            }
            return matrix3d;
        }
    },
    mounted()
    {

       

        // console.log(this.matrix);
        // this.$set(this.cubes[3].rotates, 0, 15);
        // let deg = 0;
        // setInterval(() => {
        //     this.$set(this.cubes[2].rotates, 0, deg);
        //     this.$set(this.cubes[3].rotates, 0, deg);
        //     this.$set(this.cubes[6].rotates, 0, deg);
        //     this.$set(this.cubes[7].rotates, 0, deg);

        //     deg += 90;
        // }, 1000);
    }
});