#include "rtweekend.h"

#include "camera.h"
#include "hittable.h"
#include "hittable_list.h"
#include "material.h"
#include "sphere.h"
#include <sstream>
#include <fstream>


#include <cstdio> // Necessário para freopen

int main() {
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

    // Loop para gerar diferentes imagens(ida)
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
   

    
// Loop para gerar mais 30 imagens (volta)
    for (int i = 0; i < 30; ++i) {
        // Atualiza a posição da câmera para retornar à posição inicial
        cam.lookfrom = point3(0.3 + i * 0.5, 2, 3); // Pequenos incrementos para a posição inicial
        cam.lookat = point3(0, 1 - i * 0.04, 0);    // Ajuste mais suave

        // Gera um nome de arquivo único para cada imagem
        std::string filename = "image" + std::to_string(i + 30) + ".ppm";

        // Redireciona a saída padrão para o arquivo
        freopen(filename.c_str(), "w", stdout);

        // Renderiza a imagem e a escreve no arquivo atual
        cam.render(world);

        // Fecha o arquivo atual
        fclose(stdout);
    }
    

    
    // Loop para mover a grande bola de ferro para a esquerda
  
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
    
    
    return 0;
}
