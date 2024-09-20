# Processamento Gráfico - PP2
Repositório respectivo aos projetos da disciplina de Processamento Gráfico, este arquivo .README trará a documentação do projeto de Ray tracing, em que desenvolvemos uma curta animação com uso da tecnologia de traçado de raio, e do projeto de webGL, em que plotamos dois objetos 3D no espaço.

## Projeto de Ray tracing
### Descrição
Geramos imagens em sequência para formar uma animação de 7 segundos, nela, distribuímos 5 esferas num plano cinza, sendo três esferas maiores e duas menores, duas das esferas maiores se movem lentamente, demonstrando os reflexos da técnica de ray tracing aplicada.

### Código

- Importamos os header files do material "Ray tracing in one weekend" para usarmos como bibliotecas de suporte no desenvolvimento do projeto

- Na main, primeiramente criamos uma lista de hittable objects, os quais são:

	- O chão, criado como um material que espalha a luz de maneira difusa, com cor cinza claro.
	- Adicionamos uma esfera ao mundo, com 1000 de diâmetro em (0, -1000, 0), criando um chão plano, já que a esfera está bem abaixo da origem da câmera.
	- Adicionamos uma esfera verde no ponto (1, 0.25, 2) com raio 0.2.
	- Adicionamos uma esfera azul no ponto (1.5, 0.25, 1.5) com raio 0.2.
	- Adicionamos uma esfera de vidro no ponto (2, 1, -0.5) com raio 1.
	- Adicionamos uma esfera marrom no ponto (0, 1, 0) com raio 1.
	- Adicionamos uma esfera prateada metálica no ponto (0, 1, 2) de raio 1.
	
    Trecho respectivo:
	````
    hittable_list world;

    auto ground_material = make_shared<lambertian>(color(0.5, 0.5, 0.5));
    world.add(make_shared<sphere>(point3(0, -1000, 0), 1000, ground_material));

    // Criação de outros objetos no mundo...
    auto sphere_material = make_shared<lambertian>(color(0,1,0));
    world.add(make_shared<sphere>(point3(1, 0.25, 2), 0.2, sphere_material));

    auto sphere_material2 = make_shared<lambertian>(color(0,0,1)*color(0,0,1));
    world.add(make_shared<sphere>(point3(1.5, 0.25, 1.5), 0.2, sphere_material2));

    auto material1 = make_shared<dielectric>(1.5);
    world.add(make_shared<sphere>(point3(2, 1, -0.5), 1.0, material1));

    auto material2 = make_shared<lambertian>(color(0.4, 0.2, 0.1));
    world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material2));

    auto material3 = make_shared<metal>(color(0.7, 0.6, 0.5), 0.0);
    world.add(make_shared<sphere>(point3(0, 1, 2), 1.0, material3)); 
    ````
- Depois, criamos um objeto câmera com:
	- Proporção 16:9
	- Largura em 1280px
	- Dez amostras por pixel(AA)
	- Até 20 reflexões de raios
	- FOV vertical em 20 graus
	- Posição (13, 2, 3)
	- Ponto focal (0,0,0)
	- Direção da câmera (0,1,0) "pra cima" 
	- Ângulo de desfoque 0.5
	- Distância de foco 10
   
   Trecho respectivo:
   ````
    camera cam;

    cam.aspect_ratio = 16.0 / 9.0;
    cam.image_width = 1280;
    cam.samples_per_pixel = 10;
    cam.max_depth = 20;

    cam.vfov = 20;
    cam.lookfrom = point3(13, 2, 3);
    cam.lookat = point3(0, 0, 0);
    cam.vup = vec3(0, 1, 0);

    cam.defocus_angle = 0.6;
    cam.focus_dist = 10.0;
    ````
- Após, começamos com os movimentos da câmera
	- Utilizamos um loop que incrementa a variável i para movimentar a câmera ao longo dos eixos X e Z: ````cam.lookfrom = point3(13 - i * 0.3, 2, 3 - i * 0.1)````
	- Mantemos o foco sempre no ponto (0,0,0)
	- Geramos um arquivo para cada imagem no loop

	Trecho respectivo:
    ````    // Loop para gerar diferentes imagens(ida)
    for (int i = 0; i < 30; ++i) {
        // Ajuste a posição da câmera para dar zoom (aproximar a câmera)
        // Reduzindo a distância ao longo do eixo Z
        cam.lookfrom = point3(13 - i * 0.3, 2, 3 - i * 0.1); // Ajuste suave na posição
        cam.lookat = point3(0, 0, 0); // Manter o foco no mesmo ponto

        // Gera um nome de arquivo único para cada imagem
        std::string filename = "image" + std::to_string(i) + ".ppm";

        // Redireciona a saída padrão para o arquivo
        freopen(filename.c_str(), "w", stdout);

        // Renderiza a imagem e a escreve no arquivo atual
        cam.render(world);

        // Fecha o arquivo atual
        fclose(stdout);
    } 
    ````
- Fazemos o trajeto de volta para a posição inicial
	
    Trecho respectivo:
    ````        
    	cam.lookfrom = point3(0.3 + i * 0.5, 2, 3); // Pequenos incrementos para a posição inicial
        cam.lookat = point3(0, 1 - i * 0.04, 0);    // Ajuste mais suave
    ````
    
    
 - Agora, esse trecho de código cria um novo mundo em cada iteração, adiciona diversas esferas com diferentes materiais, e move a esfera metálica lentamente para a esquerda.
 	- Os outros objetos são estáticos, apenas a esfera se move com base na iteração de i em ````world.add(make_shared<sphere>(point3(-frame * 0.1, 1, 2 + frame * 0.11), 1.0, material3)); ````
 	- Os arquivos são salvos a cada iteração, assim como nas partes anteriores
 	
    Trecho respectivo:
    ````
    	
    for (int frame = 0; frame < 30; ++frame) {
        // Cria um novo mundo para cada iteração
        hittable_list world;
    
        auto ground_material = make_shared<lambertian>(color(0.5, 0.5, 0.5));
        world.add(make_shared<sphere>(point3(0, -1000, 0), 1000, ground_material));
    
        // Criação de outros objetos no mundo...
        auto sphere_material = make_shared<lambertian>(color(0, 1, 0));
        world.add(make_shared<sphere>(point3(1, 0.25, 2), 0.2, sphere_material));

        auto sphere_material2 = make_shared<lambertian>(color(0,0,1)*color(0,0,1));
        world.add(make_shared<sphere>(point3(1.5, 0.25, 1.5), 0.2, sphere_material2));
    
        auto material1 = make_shared<dielectric>(1.5);
        world.add(make_shared<sphere>(point3(2, 1, -0.5), 1.0, material1));
    
        auto material2 = make_shared<lambertian>(color(0.4, 0.2, 0.1));
        world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material2));
    
        auto material3 = make_shared<metal>(color(0.7, 0.6, 0.5), 0.0);
        // Move a bola para a esquerda lentamente
        world.add(make_shared<sphere>(point3(-frame * 0.1, 1, 2+frame*0.11), 1.0, material3));
    
        // Gera um nome de arquivo único para cada imagem
        std::string filename = "image" + std::to_string(frame+60) + ".ppm";
    
        // Redireciona a saída padrão para o arquivo
        freopen(filename.c_str(), "w", stdout);
    
        // Renderiza a imagem e a escreve no arquivo atual
        cam.render(world);
    
        // Fecha o arquivo atual
        fclose(stdout);
    }
    ````
- Agora, o mesmo trecho acima é repetido, mas para a outra esfera, ela é movida para a direita.
	- O movimento usa a iteração de i: ```` world.add(make_shared<sphere>(point3(-frame * 0.1, 1, 5.19 ), 1.0, material3));````
	- Também são salvos os arquivo a cada iteração
	- As múltiplas iterações geram várias imagens que, quando combinadas, geram a animação

	Trecho respectivo:
    ````
    for (int frame = 0; frame < 30; ++frame) {
        // Cria um novo mundo para cada iteração
        hittable_list world;
    
        auto ground_material = make_shared<lambertian>(color(0.5, 0.5, 0.5));
        world.add(make_shared<sphere>(point3(0, -1000, 0), 1000, ground_material));
    
        // Criação de outros objetos no mundo...
        auto sphere_material = make_shared<lambertian>(color(0, 1, 0));
        world.add(make_shared<sphere>(point3(1, 0.25, 2), 0.2, sphere_material));
    
        auto material1 = make_shared<dielectric>(1.5);
        world.add(make_shared<sphere>(point3(2, 1, -0.5-frame*0.14), 1.0, material1));

        auto sphere_material2 = make_shared<lambertian>(color(0,0,1)*color(0,0,1));
        world.add(make_shared<sphere>(point3(1.5, 0.25, 1.5), 0.2, sphere_material2));
    
        auto material2 = make_shared<lambertian>(color(0.4, 0.2, 0.1));
        world.add(make_shared<sphere>(point3(0, 1, 0), 1.0, material2));
    
        auto material3 = make_shared<metal>(color(0.7, 0.6, 0.5), 0.0);
        // Move a bola para a esquerda lentamente
        world.add(make_shared<sphere>(point3(-frame * 0.1, 1, 5.19 ), 1.0, material3));
    
        // Gera um nome de arquivo único para cada imagem
        std::string filename = "image" + std::to_string(frame+90) + ".ppm";
    
        // Redireciona a saída padrão para o arquivo
        freopen(filename.c_str(), "w", stdout);
    
        // Renderiza a imagem e a escreve no arquivo atual
        cam.render(world);
    
        // Fecha o arquivo atual
        fclose(stdout);
    }
    ````
 - Por fim, ao unirmos os arquivos de imagens, geramos a animação, a qual pode ser encontrada na pasta output
 
![Exemplo de Animação](Raytracing/pp2.gif)
    
## Projeto no webGL
### Descrição
Configuramos um ambiente WebGL para renderizar uma esfera e uma pirâmide em 3D 


### Código - Esfera.js   
- Vertex Shade
	- Objetivo: Define o comportamento do vértice.
	- Atributos: vertPosition e vertColor recebem as posições e cores dos vértices.
	- Variável Varying: fragColor passa a cor para o fragment shader.
	- Transformação: Aplica as matrizes de mundo, visualização e projeção à posição do vértice.

	Trecho respectivo:
    ````
  var vertexShaderText = 
  [
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main()',
  '{',
  ' fragColor = vertColor;',
  ' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  '}'
  ].join('\n');
    ````
- Fragment Shader
	- Objetivo: Define a cor dos pixels.
	- Varying: Usa fragColor para determinar a cor final do fragmento.

	Trecho respectivo:
    ````
  var fragmentShaderText =
  [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  ' gl_FragColor = vec4(fragColor, 1.0);',
  '}'
  ].join('\n');
    ````
 - Função Generate Spheres Vertex
  	- O primeiro loop itera sobre as bandas de latitude, calculando o ângulo theta.
	- O segundo loop itera sobre as bandas de longitude, calculando o ângulo phi.
	- Para cada combinação de theta e phi:
	- Calcula as coordenadas esféricas (x, y, z) usando funções trigonométricas.
	- Calcula as coordenadas de textura (u, v) para mapeamento de textura.
	- Adiciona as coordenadas (x, y, z) multiplicadas pelo radius e as coordenadas de textura ao array vertices.

	Trecho respectivo:
   
````
for (let latNumber = 0; latNumber <= latBands; ++latNumber {
    let theta = latNumber * Math.PI / latBands;
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let longNumber = 0; longNumber <= longBands; ++longNumber) {
        let phi = longNumber * 2 * Math.PI / longBands;
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);

        let x = cosPhi * sinTheta;
        let y = cosTheta;
        let z = sinPhi * sinTheta;

        let u = 1 - (longNumber / longBands);
        let v = 1 - (latNumber / latBands;

        vertices.push(radius * x, radius * y, radius * z, u, v, 1.0);
    }}
  ````
   
 - Loop para calcular índices:
   	- Este loop cria os índices para desenhar a superfície da esfera.
	- Para cada par de bandas de latitude e longitude:
	- Calcula dois índices first e second, que representam os vértices que formam dois triângulos.
	- Adiciona os índices ao array indices para formar a superfície da esfera.
	
 ````
  for (let latNumber = 0; latNumber < latBands; ++latNumber) {
      for (let longNumber = 0; longNumber < longBands; ++longNumber) {
          let first = (latNumber * (longBands + 1)) + longNumber;
          let second = first + longBands + 1;

          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
      }
  }
 ````
- Por fim, a função retorna um objeto contendo os arrays vertices e indices, que serão usados para desenhar a esfera no WebGL.

- Função InitDemo:
	- A função InitDemo configura um contexto WebGL, carrega e compila shaders, gera a geometria de uma esfera, configura buffers e atributos, e inicia um loop de renderização que anima a esfera.
 	- Obtém o elemento canvas com o ID game-surface e tenta criar um contexto WebGL. Se não conseguir, tenta o contexto experimental.
  Se o WebGL não for suportado, exibe um alerta.
  - Define a cor de fundo do canvas usando gl.clearColor().
  Limpa o buffer de cor e de profundidade com gl.clear().
  Habilita o teste de profundidade (gl.enable(gl.DEPTH_TEST)) e desabilita a remoção de faces (gl.disable(gl.CULL_FACE)).
  - Cria os shaders de vértice e fragmento.
  Usa gl.shaderSource() para carregar o código dos shaders e gl.compileShader() para compilar.
  Verifica se a compilação foi bem-sucedida e exibe um erro, se necessário.
  - Cria um programa shader, anexa os shaders de vértice e fragmento, e faz o link.
  Valida o programa e exibe erros, se houver.
 ````
 
    console.log('This is working');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('webgl not supported');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Does not support webgl');
    }

    var mat4 = glMatrix.mat4;

    gl.clearColor(0.75, 0.8, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR compiling program');
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program');
        return;
    }
   ````
  - Continuação:
  	- Chama generateSphereVertices(1, 30, 30) para gerar os dados de vértices e índices da esfera. O raio é 1, com 30 bandas de latitude e longitude.
    - Cria e vincula um buffer para os vértices (gl.ARRAY_BUFFER) e carrega os dados da esfera.
    Cria e vincula um buffer para os índices (gl.ELEMENT_ARRAY_BUFFER) e carrega os índices.
    - Obtém as localizações dos atributos de posição e cor nos shaders.
    Usa gl.vertexAttribPointer() para especificar como os dados dos vértices devem ser interpretados e habilita esses atributos.
    - Inicializa as matrizes de mundo, visão e projeção.
    A matriz de visão é configurada para olhar do ponto (0, 0, -6) para a origem (0, 0, 0).
    A matriz de projeção é definida para uma perspectiva de 45 graus.
    - Cria uma função chamada loop, que atualiza o ângulo de rotação da esfera a cada quadro usando performance.now().
    Atualiza as matrizes de rotação e envia a matriz de mundo para o shader.
    Limpa a tela e desenha a esfera com gl.drawElements().
    - Usa requestAnimationFrame(loop) para chamar a função loop repetidamente, permitindo a animação contínua.
 ````
 var sphereData = generateSphereVertices(1, 30, 30); // Gerar esfera com 30 bandas de latitude e longitude
    var sphereVertices = sphereData.vertices;
    var sphereIndices = sphereData.indices;

    var sphereVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);

    var sphereIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -6], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;

    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(yRotationMatrix, identityMatrix, angle * 4, [0, 1, 0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle * 2, [1, 0, 0]);
        mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  ````

### Pirâmide.js
	