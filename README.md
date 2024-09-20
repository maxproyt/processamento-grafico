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
- 
    