{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { nixpkgs, ... }:
    let
      pkgs = nixpkgs.legacyPackages."x86_64-linux";
    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs
          pkgs.python314Packages.fastapi
          pkgs.python314Packages.fastapi.optional-dependencies.standard
          pkgs.python314Packages.pyjwt
          pkgs.python314Packages.pwdlib
          pkgs.python314Packages.ruff
        ];
      };
    };
}
