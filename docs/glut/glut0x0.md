# OpenGL Utility Toolkit 0x0

## Description

Draw `f(x) = sin x / x, x ∈ [-20, 20]`, Using the following transform:

sx = Ax + B

sy = Cy + D

Do not use `gluOrtho2D`.

### Step

* Header File: `GL.h  GLU.h  glut.h`
* Library: `GlU32.Lib  glut32.lib  OpenGL32.Lib`
* DLL: `glu32.dll  glut32.dll  opengl32.dll`

## Example

```Cpp
#include <bits/stdc++.h>
#include <windows.h>
#include <GL/glut.h>
using namespace std;

struct BASE_CONFIG {
    float windows_w;
    float windows_h;
    string windows_title;
    float vp_x;
    float vp_y;
    float vp_w;
    float vp_h;
    float point_size;
};

BASE_CONFIG config = {
    windows_w: 640,
    windows_h: 480,
    windows_title: "hello world",
    vp_x: .0f,
    vp_y: .0f,
    vp_w: 40.0f,
    vp_h: 4.0f,
    point_size: 1
};

/*
 * A = (vr - vl) / (wr - wl) = (20 - (-20)) / (1 - (-1)) = 20
 * C = vl - A * wl = -20 - 20 * (-1) = 0
 * sx = 20 * x
 * x = sx / 20
 * B = (vt - vb) / (wt - wb) = 4 / 2 = 2
 * D = wt - B * wb = 2 - 2 * (-1) = 0
 * sy = 2 * y + 0
 * y = sy / 2
 */

void myInit() {
    glClearColor(1.0f, 1.0f, 1.0f, 0.0f);
    glColor3f(.0f, .0f, .0f); // black
    // glPointSize(config.point_size);
    // glMatrixMode(GL_PROJECTION);
    // glLoadIdentity();
    // gluOrtho2D(config.vp_x, config.windows_w, config.vp_y, config.windows_h);
}

void myDisplay() {
    glClear(GL_COLOR_BUFFER_BIT);
    glBegin(GL_LINE_STRIP);
    {
        for (float i = - config.vp_w / 2.0f; i <= config.vp_w / 2.0f; i += 0.01f) {
            float x = i;
            float y = x == 0.0f ? 1.0f : (sin(x) / x);
            x = x / 20.0f;
            y = y / 2.0f;
            cout << x << "\t" << y << endl;
            glVertex2f(x, y);
        }
    }
    glEnd();
    glFlush();
}

void rectDisplay() {
    glClear(GL_COLOR_BUFFER_BIT);
    glRectf(-0.9f, -0.9f, 0.9f, 0.9f);
    glFlush();
}

int main(int argc, char** argv, char** envp) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(config.windows_w, config.windows_h);
    glutCreateWindow(config.windows_title.c_str());

    myInit();

    glutDisplayFunc(&myDisplay);
    glutMainLoop();
    return 0;
}
```
